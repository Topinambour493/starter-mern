import {LoginType} from "../../types";
import {SubmitHandler, useForm, UseFormRegister} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import './Login.scss'
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {useNavigate} from "react-router";
import {loginRedux, resetError} from "../../Redux/userSlice";
import {useAppSelector} from "../../Redux/hooks";
import {getValue} from "@testing-library/user-event/dist/utils";
import {AppDispatch} from "../../Redux/store";

export default function Login() {

  let navigate = useNavigate();
  const {statusLogin, error} = useAppSelector(state => state.user);
  const dispatch = useDispatch<AppDispatch>();



  async function connection(e: React.FormEvent<HTMLFormElement> , data: LoginType) {
    e.preventDefault();
    await dispatch(loginRedux(data));
  }

  dispatch(resetError())

  useEffect(() => {
    if (statusLogin === 'success') {
      navigate('/');
    } else if (statusLogin === 'failed') {
      console.log(error);
    }
  }, [statusLogin]);

  // Fonction pour naviguer vers la page register
  const goToRegister = () => {
    navigate('/register'); // Redirige vers la page d'inscription
  };

  const schema = yup.object({
    email: yup.string().email("Email invalide").required("L'email est obligatoire"),
    password: yup.string().required("Le mot de passe est obligatoire"),
  });

  const {
    register: login,
    getValues,
    formState: {errors},
  } = useForm<LoginType>({
    resolver: yupResolver(schema),
  })

  return (
    <div id={"login"}>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => connection(e, getValues())}>
        <label>Email:
          <input {...login("email")} />
          <p>{errors.email?.message || "\u00A0"}</p>
        </label>
        <label>
          Mot de passe:
          <input type={"password"} {...login("password")} />
        </label>
        <p>{errors.password?.message || "\u00A0"}</p>
        <div className={"error"}>{error}</div>
        <button type="submit">Envoyer</button>
        <button onClick={goToRegister} style={{marginTop: '20px'}}>
          Inscription
        </button>
      </form>
    </div>
  )
}