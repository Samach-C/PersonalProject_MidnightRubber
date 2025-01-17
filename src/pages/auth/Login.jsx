import { useState } from "react";
import MainNav from "../../components/MainNav";
import useUserStore from "../../stores/userStore";
import Register from "./Register";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate()
  const login = useUserStore( state => state.login)
  const [input, setInput] = useState({
    email: "",
    password: "",
  })

  const [reInput, setReInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value}))
  }

  const hdlLogin = async(e) => {
    // console.log("hello login")
   
      e.preventDefault()
      if(!(input.email.trim() && input.password.trim())) {
        return toast.warning("Please fill all input")
      }
      try {
      let data = await login(input)
      // console.log(data.user.role)
      if(data.user.role == "ADMIN") {
        navigate("/admin")
      }else {
        navigate("/")
      }
    } catch(err) {
      const errMsg = err.response?.data?.message || err.message
      console.log(err.response.data.message)
      toast.error(errMsg)
    }
  }

  const clearRegisterForm = () => {
    setReInput({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setFormErrors({})
  }
  return (
    <>
      <MainNav />
      <div className="flex flex-1 justify-center items-center mt-14 mb-0">
        <div className="card bg-base-100 w-[400px] h-[350px] shadow-xl mt-8">
          <form onSubmit={hdlLogin}>
            <div className="card-body gap-3 p-4">
              <input
                type="text"
                placeholder="E-mail"
                className="input input-bordered w-full"
                name="email"
                value={input.email}
                onChange={hdlChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                name="password"
                value={input.password}
                onChange={hdlChange}
              />
              <button className="btn btn-primary text-xl">Log in</button>
              <p className="opacity-70 text-center cursor-pointer flex-grow-0">
                Forgotten password?
              </p>
              <div className="divider my-0"></div>
              <button
                type="button"
                className="btn btn-secondary text-lg text-white w-fit mx-auto"
                onClick={() =>
                  document.getElementById("register-modal").showModal()
                }
              >
                Create new account
              </button>
            </div>
          </form>
        </div>
      </div>
      <dialog id="register-modal" className="modal">
        <div className="modal-box">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={(e) => {
              clearRegisterForm()
              e.target.closest("dialog").close()
            }}
          >
            ✕
          </button>

          <Register input={reInput} setInput={setReInput} formErrors={formErrors} setFormErrors={setFormErrors} />
        </div>
      </dialog>
    </>
  );
};


