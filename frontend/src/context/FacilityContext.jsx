import React,{createContext,useContext,useState,useEffect} from 'react';
import {initialUsers,initialRooms,initialEquipment,initialIssues} from '../data/initialData';

const FacilityContext=createContext();
const API_URL='http://localhost:5000/api';

export const FacilityProvider=({children})=>{
  const [users,setUsers]=useState(()=>{
    const saved=localStorage.getItem('cf_users');
    return saved?JSON.parse(saved):initialUsers;
  });

  const [currentUser,setCurrentUser]=useState(null);

  const [rooms,setRooms]=useState(()=>{
    const saved=localStorage.getItem('cf_rooms');
    return saved?JSON.parse(saved):initialRooms;
  });

  const [equipment,setEquipment]=useState(()=>{
    const saved=localStorage.getItem('cf_equipment');
    return saved?JSON.parse(saved):initialEquipment;
  });

  const [issues,setIssues]=useState(()=>{
    const saved=localStorage.getItem('cf_issues');
    return saved?JSON.parse(saved):initialIssues;
  });

  const [activeTab,setActiveTab]=useState('dashboard');
  const [searchQuery,setSearchQuery]=useState('');
  const [statusFilter,setStatusFilter]=useState('Unresolved');
  const [equipmentFilter,setEquipmentFilter]=useState('All');
  const [roomFilter,setRoomFilter]=useState('All');
  const [selectedIssueModal,setSelectedIssueModal]=useState(null);
  const [isReportModalOpen,setIsReportModalOpen]=useState(false);
  const [isLoginModalOpen,setIsLoginModalOpen]=useState(true);
  const [isBackendConnected,setIsBackendConnected]=useState(false);

  useEffect(()=>{
    if(currentUser){
      localStorage.setItem('cf_current_user',JSON.stringify(currentUser));
    }else{
      localStorage.removeItem('cf_current_user');
    }
  },[currentUser]);

  useEffect(()=>{
    localStorage.setItem('cf_users',JSON.stringify(users));
  },[users]);

  useEffect(()=>{
    localStorage.setItem('cf_rooms',JSON.stringify(rooms));
  },[rooms]);

  useEffect(()=>{
    localStorage.setItem('cf_equipment',JSON.stringify(equipment));
  },[equipment]);

  useEffect(()=>{
    localStorage.setItem('cf_issues',JSON.stringify(issues));
  },[issues]);

  useEffect(()=>{
    const checkBackend=async()=>{
      try{
        const res=await fetch(`${API_URL}/health`);
        if(res.ok){
          setIsBackendConnected(true);
          const[resRooms,resEq,resIss]=await Promise.all([
            fetch(`${API_URL}/rooms`),
            fetch(`${API_URL}/equipment`),
            fetch(`${API_URL}/issues`)
          ]);
          if(resRooms.ok)setRooms(await resRooms.json());
          if(resEq.ok)setEquipment(await resEq.json());
          if(resIss.ok)setIssues(await resIss.json());
        }
      }catch(err){
        setIsBackendConnected(false);
      }
    };
    checkBackend();
  },[]);

  const finishLogin=(userObj)=>{
    setCurrentUser(userObj);
    setIsLoginModalOpen(false);
    if(userObj.role==='Technician'){
      setActiveTab('tech-queue');
    }else if(userObj.role==='Admin'){
      setActiveTab('dashboard');
    }else if(userObj.role==='Faculty'){
      setActiveTab('inventory');
    }else{
      setActiveTab('matrix');
    }
  };

  const login=async({username,password})=>{
    if(isBackendConnected){
      try{
        const response=await fetch(`${API_URL}/auth/login`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({username,password})
        });
        const data=await response.json();
        if(!response.ok)return{success:false,message:data.message||'Unable to sign in.'};
        setUsers(previous=>previous.some(user=>user.id===data.user.id)?previous:[...previous,data.user]);
        finishLogin(data.user);
        return{success:true};
      }catch(error){}
    }

    const user=users.find(user=>user.username?.toLowerCase()===username.trim().toLowerCase());
    if(user&&(user.password||'campus123')===password){
      finishLogin(user);
      return{success:true};
    }
    return{success:false,message:'Incorrect username or password.'};
  };

  const signup=async({name,username,password,role,department})=>{
    const cleanName=name.trim();
    const cleanUsername=username.trim().toLowerCase();

    if(!cleanName||!cleanUsername||!password){
      return{success:false,message:'Name, username, and password are required.'};
    }

    if(!/^[a-z0-9._-]{3,24}$/.test(cleanUsername)){
      return{success:false,message:'Use 3–24 letters, numbers, dots, dashes, or underscores for the username.'};
    }

    if(password.length<6){
      return{success:false,message:'Password must be at least 6 characters.'};
    }

    if(isBackendConnected){
      try{
        const response=await fetch(`${API_URL}/auth/signup`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({name:cleanName,username:cleanUsername,password,role,department})
        });
        const data=await response.json();
        if(!response.ok)return{success:false,message:data.message||'Unable to create account.'};
        setUsers(previous=>[...previous,data.user]);
        finishLogin(data.user);
        return{success:true};
      }catch(error){}
    }

    if(users.some(user=>user.username?.toLowerCase()===cleanUsername)){
      return{success:false,message:'That username is already in use.'};
    }

    const avatarByRole={
      Admin:'👨‍💼',
      Technician:'🛠️',
      Faculty:'👨‍🏫',
      Student:'🎓'
    };

    const user={
      id:`USR-${Date.now()}`,
      name:cleanName,
      username:cleanUsername,
      password,
      role,
      department:department.trim()||'Campus Community',
      avatar:avatarByRole[role]||'🎓',
      title:role==='Student'?'Campus Member':`${role} Member`
    };

    setUsers(previous=>[...previous,user]);
    finishLogin(user);
    return{success:true};
  };

  const logout=()=>{
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  const addIssue=async(issueData)=>{
    const nowStr=new Date().toLocaleString('en-US',{
      year:'numeric',
      month:'2-digit',
      day:'2-digit',
      hour:'2-digit',
      minute:'2-digit',
      hour12:true
    });

    const reporterName=currentUser?currentUser.name:(issueData.reportedBy||'Staff Caretaker');

    const newIssue={
      id:`TKT-${1000+issues.length+1}`,
      roomNumber:issueData.roomNumber,
      equipmentType:issueData.equipmentType,
      equipmentId:issueData.equipmentId||'CUSTOM-EQ',
      equipmentName:issueData.equipmentName||`${issueData.equipmentType} (Room ${issueData.roomNumber})`,
      issue:issueData.issueTitle,
      description:issueData.description,
      status:'Reported',
      priority:issueData.priority||'Medium',
      reportedBy:reporterName,
      reportedAt:nowStr,
      assignedTechnician:issueData.assignedTechnician||'Unassigned',
      estimatedCost:'Pending Assessment',
      updates:[{timestamp:nowStr,text:`Issue reported by ${reporterName}.`}]
    };

    setIssues(prev=>[newIssue,...prev]);

    if(issueData.equipmentId){
      setEquipment(prev=>prev.map(item=>item.id===issueData.equipmentId?{...item,status:'Needs Service'}:item));
    }

    if(isBackendConnected){
      try{
        await fetch(`${API_URL}/issues`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({...issueData,reportedBy:reporterName})
        });
      }catch(e){}
    }
  };

  const updateIssueStatus=async(issueId,newStatus,technician=null,note='')=>{
    const nowStr=new Date().toLocaleString('en-US',{
      year:'numeric',
      month:'2-digit',
      day:'2-digit',
      hour:'2-digit',
      minute:'2-digit',
      hour12:true
    });

    setIssues(prev=>prev.map(issue=>{
      if(issue.id===issueId){
        const updatedTech=technician!==null?technician:issue.assignedTechnician;
        const newUpdate={
          timestamp:nowStr,
          text:`Status changed to "${newStatus}"${technician?`. Assigned to: ${technician}`:''}${note?`. Note: ${note}`: ''}.`
        };

        if(issue.equipmentId){
          let eqStatus='Operational';
          if(newStatus==='Under repair'||newStatus==='In Progress'){
            eqStatus='Under Repair';
          }else if(newStatus==='Reported'){
            eqStatus='Needs Service';
          }

          setEquipment(prevEq=>prevEq.map(eq=>eq.id===issue.equipmentId?{...eq,status:eqStatus}:eq));
        }

        return{
          ...issue,
          status:newStatus,
          assignedTechnician:updatedTech,
          updates:[newUpdate,...issue.updates]
        };
      }
      return issue;
    }));

    if(isBackendConnected){
      try{
        await fetch(`${API_URL}/issues/${issueId}`,{
          method:'PATCH',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({status:newStatus,technician,note})
        });
      }catch(e){}
    }
  };

  const resetToDefaultData=async()=>{
    setRooms(initialRooms);
    setEquipment(initialEquipment);
    setIssues(initialIssues);
    setUsers(initialUsers);
    setCurrentUser(null);

    localStorage.removeItem('cf_rooms');
    localStorage.removeItem('cf_equipment');
    localStorage.removeItem('cf_issues');
    localStorage.removeItem('cf_current_user');
    localStorage.removeItem('cf_users');

    setIsLoginModalOpen(true);

    if(isBackendConnected){
      try{
        await fetch(`${API_URL}/reset`,{method:'POST'});
      }catch(e){}
    }
  };

  const totalIssuesCount=issues.length;
  const unresolvedIssues=issues.filter(issue=>issue.status!=='Resolved'&&issue.status!=='Closed');
  const unresolvedCount=unresolvedIssues.length;
  const underRepairCount=issues.filter(issue=>issue.status?.toLowerCase()==='under repair').length;
  const reportedCount=issues.filter(issue=>issue.status?.toLowerCase()==='reported').length;
  const resolvedCount=issues.filter(issue=>issue.status?.toLowerCase()==='resolved').length;

  const techWorkOrders=currentUser?.role==='Technician'
    ?issues.filter(issue=>issue.assignedTechnician?.toLowerCase().includes(currentUser.name.toLowerCase())||issue.assignedTechnician==='Unassigned')
    :[];

  const totalEquipmentCount=equipment.length;
  const operationalEqCount=equipment.filter(item=>item.status==='Operational').length;
  const healthPercentage=Math.round((operationalEqCount/(totalEquipmentCount||1))*100);

  return(
    <FacilityContext.Provider value={{
      users,
      currentUser,
      userRole:currentUser?.role||'Guest',
      login,
      signup,
      logout,
      rooms,
      equipment,
      issues,
      unresolvedIssues,
      techWorkOrders,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
      equipmentFilter,
      setEquipmentFilter,
      roomFilter,
      setRoomFilter,
      selectedIssueModal,
      setSelectedIssueModal,
      isReportModalOpen,
      setIsReportModalOpen,
      isLoginModalOpen,
      setIsLoginModalOpen,
      isBackendConnected,
      addIssue,
      updateIssueStatus,
      resetToDefaultData,
      stats:{
        totalIssuesCount,
        unresolvedCount,
        underRepairCount,
        reportedCount,
        resolvedCount,
        totalEquipmentCount,
        operationalEqCount,
        healthPercentage
      }
    }}>
      {children}
    </FacilityContext.Provider>
  );
};

export const useFacility=()=>{
  const context=useContext(FacilityContext);
  if(!context){
    throw new Error('useFacility must be used within FacilityProvider');
  }
  return context;
};