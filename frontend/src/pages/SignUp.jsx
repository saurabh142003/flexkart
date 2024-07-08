import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

function SignUp() {
    const [formData, setFormData] = useState({username:'',email: '', password: ''});
    const [response, setResponse] = useState("");
    const [loading,setLoading] = useState(false)

    const navigate = useNavigate();

    function changeHandler(e) {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }

    async function submitHandler(e) {
        const {username,email,password} = formData
        e.preventDefault();
        if(!username || !email || !password){
            return;
        }
       
        try {
            setLoading(true)
            const result = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            if(result) console.log("succes")
            else console.log("failde")
         
            const data = await result.json();
           setResponse(data.message)
            setLoading(false)
            setTimeout(()=>{
                navigate('/signin')
            },2000)
            
        } catch (err) {
            setLoading(false)
            console.log('Error:', err);
            setResponse("An error occurred. Please try again.");
        }
    }
    

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <form onSubmit={submitHandler} className='w-full max-w-md p-6 bg-white shadow-2xl rounded-md mt-8 flex flex-col items-center gap-4'>
                <div className='w-full'>
                    <input type="text" onChange={changeHandler} id='username' placeholder='Username' className='w-full text-base mt-3 outline-none border border-gray-300 rounded-md p-4 focus:border-blue-500' />
                </div>
                <div className='w-full'>
                    <input type="email" onChange={changeHandler} id='email' placeholder='Your E-mail' className='w-full text-base mt-3 outline-none border border-gray-300 rounded-md p-4 focus:border-blue-500' />
                </div>
                <div className='w-full'>
                    <input type="password" onChange={changeHandler} id='password' placeholder='Your Password' className='w-full text-base mt-3 outline-none border border-gray-300 rounded-md p-4 focus:border-blue-500' />
                </div>
                <div className='w-full'>
                    <button type="submit" className='w-full uppercase bg-blue-800 p-3 mt-4 text-white rounded-md shadow-lg hover:bg-blue-700'>{loading?"Loading..":"Sign Up"}</button>
                </div>
                <OAuth/>
                <div className='flex gap-2 mt-5'>
                    <p className="text-base font-thin">Already have an account?</p>
                    <NavLink className="text-blue-800 underline hover:text-blue-600" to="/signin">Sign In</NavLink>
                </div>
               
            </form>
        </div>
    );
}

export default SignUp;

