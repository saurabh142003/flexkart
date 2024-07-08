import React from 'react'
import { GoogleAuthProvider , getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../Firebase';
import { useDispatch } from 'react-redux';
import { success } from '../redux/UserSlice';
import { useNavigate } from 'react-router-dom';

function OAuth() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

   async function handleGoogleClick(){
        try{
            
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app)
            const result = await signInWithPopup(auth,provider)
            
            const res = await fetch('/api/auth/google',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({name:result.user.displayName,email:result.user.email,avatar:result.user.photoURL})
        

            })
            const data = await res.json()
            dispatch(success(data))
            console.log(data)
            navigate("/")
        } catch(err){
            console.log(err)
        }
   }


    return (
        <div className='w-full'>
            <button onClick={handleGoogleClick} type="button" className="uppercase w-full p-3 text-white bg-red-700 rounded-lg text-center hover:opacity-95">continue with google</button>
        </div>

    )
}

export default OAuth