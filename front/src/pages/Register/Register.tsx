import { RegisterType} from "../../types";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import './Register.scss'
import React, {useEffect} from "react";
import {registerRedux, resetError} from "../../Redux/userSlice";
import {getValue} from "@testing-library/user-event/dist/utils";
import {useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {useAppSelector} from "../../Redux/hooks";
import {AppDispatch} from "../../Redux/store";


export default function Register() {

  let navigate = useNavigate();

  const { statusRegister, error } = useAppSelector(state => state.user);
  const dispatch = useDispatch<AppDispatch>();

  async function handleRegister(e: React.FormEvent<HTMLFormElement>, data: RegisterType ) {
    e.preventDefault();
    await dispatch(registerRedux(data));

  }

  // Redirige vers la page d'accueil après l'inscription réussie
  useEffect(() => {
    if (statusRegister === 'success') {
      navigate('/');
    } else if (statusRegister === 'failed') {
      console.log(error);
    }
  }, [statusRegister])

  useEffect(() => {
    dispatch(resetError())
  }, []);

  // Redirige vers la page de connexion
  const goToLogin =  () => {
    navigate('/login');
  };

  const schema = yup.object({
    firstname: yup.string().required("Le prénom est obligatoire"),
    lastname: yup.string().required("Le nom est obligatoire"),
    email: yup.string().email("Email invalide").required("L'email est obligatoire"),
    password: yup.string().required("Le mot de passe est obligatoire")
  });


  const {
    register,
    getValues,
    formState: {errors},
  } = useForm<RegisterType>({
    resolver: yupResolver(schema),
  })



  return (
    <div id={"Register"}>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleRegister(e, getValues())}>
        <label>Prénom:
          <input {...register("firstname")} />
          <p>{errors.firstname?.message || "\u00A0"}</p>
        </label>
        <label>Nom:
          <input {...register("lastname")} />
          <p>{errors.lastname?.message || "\u00A0"}</p>
        </label>
        <label>Email:
          <input {...register("email")} />
          <p>{errors.email?.message || "\u00A0"}</p>
        </label>
        <label>
          Mot de passe:
          <input type={"password"} {...register("password")} />
        </label>
        <p>{errors.password?.message || "\u00A0"}</p>
        <div className={"error"}>{error}</div>
        <button type="submit">Envoyer</button>
        <button onClick={()=>goToLogin()} style={{marginTop: '20px'}}>
          Connexion
        </button>
      </form>
    </div>
  )
}
