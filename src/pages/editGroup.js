import React, { useEffect, useState } from "react";
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';

function EditGroup() {
  const navigate=useNavigate();
  const location=useLocation();
  const curGroup=location.state===null?null:location.state.group
  let owner=curGroup?curGroup.ownerEmail:localStorage.getItem('email')
  const [newName,setName]=useState(curGroup?curGroup.name:"")
  const [newMember,setMember]=useState("")
  const [newAdmin,setAdmin]=useState("")
  const [newTag,setTag]=useState("")
  let [members,setMembers]=useState([])
  let [admins,setAdmins]=useState([owner])
  let [tags,setTags]=useState(curGroup?curGroup.tags:[])
  useEffect(()=>{
    if(!curGroup)return
    axios({
        url:process.env.REACT_APP_ACCT_BACKEND+'group/members?groupId='+curGroup.id,
        method:'GET',
        timeout: 20000,
        headers: {
            'Content-Type': 'application/json',
            'token':localStorage.getItem('token')
        }
    }).then((response)=>{
        if(response.data.status==='success'){
          console.log(response.data.members.filter(member => member.isAdmin===false))
          setMembers(response.data.members.filter((member) => (member.isAdmin===false)).map((member) => (member.email)))
          setAdmins([
            ...admins,
            ...response.data.members.filter((member) => (member.isAdmin===true && member.email!==owner)).map((member) => (member.email))
          ])
        }else if(response.data==='invalid token'){
            alert("Session expired, please login again")
            localStorage.clear();
            window.location.assign(window.location.origin);
        }else{
            alert("Failed to load group members")
        }
    }).catch((error)=>{
        alert("Failed to load group members")
    })
  },[])
  const styles={
    title:{
      color:'rgb(89,89,89)',
      fontWeight:'bold',
      fontSize:'0.20in'
    },
    input:{
      padding:'0.1in',
      fontSize:'0.20in',
      borderRadius:'0.1in',
      marginTop:'0.15in',
      marginBottom:'0.15in',
      border: '0.5px solid',
      borderColor: 'rgb(46,117,182)'
    },
    buttons:{
      marginTop:'0.15in',
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-around'
    },
    button:{
        backgroundColor:'rgb(46,117,182)',
        height:'0.32in',
        width:'1.2in',
        borderRadius:'0.4in',
        color:'white',
        fontSize:'0.20in'
    },
    scroller:{
      height:'3in',
      borderTop: '0.5px solid',
      borderBottom: '0.5px solid',
      borderColor: 'rgb(46,117,182)',
      overflowY:'auto',
      marginBottom:'0.15in',
    },
    row:{
      width:'3.5in',
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between',
      backgroundColor:'white',
      padding:'0.15in',
      fontWeight:'bold',
      color:'rgb(89,89,89)'
    },
    rowItem:{
      textOverflow: 'ellipsis',
      width:'3in',
      textAlign:'left',
      whiteSpace:'nowrap',
      overflow:'hidden'
    }
  }
    return (
      <div style={{
        //width:'100svw',
        display:'flex',
        flexDirection:'row',
        backgroundColor:'white',
        justifyContent:'center',
        minHeight:'100svh',
        userSelect: 'none'
      }}>
        <div className="Login" style={{
            display:'flex',
            flexDirection:'column',
            width:'4in',
            backgroundColor:'white',
            justifyContent:'center',
            minHeight:'100svh',
            margin:'0.5in'
        }}>
          <div style={styles.title}>Group name:</div>
          <input 
            style={styles.input} 
            placeholder="Group name"
            value={newName}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <div style={styles.title}>Add tags:</div>
          <input 
            style={styles.input} 
            placeholder="Tag"
            value={newTag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) =>{if(e.key === 'Enter' && newTag.trim()!==""){
              for(let i in tags){
                if(tags[i]===newTag.trim()){
                  setTag("")
                  return
                }
              }
              setTags([...tags,newTag.trim()])
              setTag("")
            }}}
          ></input>
          <div style={styles.scroller}>
            {tags.map((item,index)=>(
              <div style={styles.row}>
                <div style={styles.rowItem}>{item}</div>
                <div onClick={()=>{setTags(tags.filter((o)=>o!==item))}}>X</div>
              </div>
            ))}
          </div>
          <div style={styles.title}>Add admins:</div>
          <input 
            style={styles.input} 
            placeholder="Email"
            value={newAdmin}
            onChange={(e) => setAdmin(e.target.value)}
            onKeyDown={(e) =>{if(e.key === 'Enter' && newAdmin.trim()!==""){
              for(let i in admins){
                if(admins[i]===newAdmin.toLowerCase().trim()){
                  setAdmin("")
                  return
                }
              }
              setAdmins([...admins,newAdmin.toLowerCase().trim()])
              setAdmin("")
            }}}
          ></input>
          <div style={styles.scroller}>
            {admins.map((item,index)=>(
              <div style={styles.row}>
                <div style={styles.rowItem}>{item}</div>
                {index!==0 && <div onClick={()=>{setAdmins(admins.filter((o)=>o!==item))}}>X</div>}
              </div>
            ))}
          </div>
          <div style={styles.title}>Add members:</div>
          <input 
            style={styles.input} 
            placeholder="Email"
            value={newMember}
            onChange={(e) => setMember(e.target.value)}
            onKeyDown={(e) =>{if(e.key === 'Enter' && newMember.trim()!==""){
              for(let i in members){
                if(members[i]===newMember.toLowerCase().trim()){
                  setMember("")
                  return
                }
              }
              setMembers([...members,newMember.toLowerCase().trim()])
              setMember("")
            }}}
          ></input>
          <div style={styles.scroller}>
            {members.map((item,index)=>(
              <div style={styles.row}>
                <div style={styles.rowItem}>{item}</div>
                <div onClick={()=>{setMembers(members.filter((o)=>o!==item))}}>X</div>
              </div>
            ))}
          </div>
          <div style={styles.buttons}>
            <div style={styles.button} onClick={()=>{
              axios({
                url:process.env.REACT_APP_ACCT_BACKEND+(curGroup?('edit/group?groupId='+curGroup.id):'add/group'),
                method:'POST',
                timeout: 20000,
                headers: {
                    'Content-Type': 'application/json',
                    'token':localStorage.getItem('token')
                },
                data:JSON.stringify({
                  name:newName,
                  memberEmails:members,
                  adminEmails:admins,
                  tags:tags
                })
              }).then((response)=>{
                if(response.data==='success'){
                  navigate(curGroup?-2:-1)
                }else if(response.data==='invalid token'){
                  alert("Session expired, please login again")
                  localStorage.clear();
                  window.location.assign(window.location.origin);
                }else{
                  alert(curGroup?"failed to edit group":"failed to add group")
                }
              }).catch((error)=>{
                alert(curGroup?"failed to edit group":"failed to add group")
              })
            }}>{curGroup?"Update":"Add"}</div>
            <div style={styles.button} onClick={()=>{navigate(-1)}}>Cancel</div>
          </div>
        </div>
      </div>
    );
}

export default EditGroup;