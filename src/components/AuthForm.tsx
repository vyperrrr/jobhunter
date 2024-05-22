import * as Form from "@radix-ui/react-form";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, TextArea, TextField } from "@radix-ui/themes";

import { useNavigate, useParams } from "react-router";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../services/authApi";
import { login } from "../features/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";

type Inputs = {
  email: string;
  password: string;
  confirmPassword?: string;
  fullname: string;
  role: "company" | "jobseeker";
  experiences?: string;
};

const AuthForm = () => {
  const navigate = useNavigate();

  const params = useParams<{ mode: string }>();
  const mode = params.mode;

  const { register, handleSubmit, watch } = useForm<Inputs>();
  const role = watch("role");

  const dispatch = useDispatch();

  const [
    authLogin,
    {
      data: loginData,
      isSuccess: isLoginSuccess,
      // isError: isLoginError,
      // error: loginError,
    },
  ] = useLoginUserMutation();

  const [
    authRegister,
    {
      isSuccess: isRegisterSuccess,
      // isError: isRegisterError,
      // error: registerError,
    },
  ] = useRegisterUserMutation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (mode === "login") handleLogin(data);
    if (mode === "register") handleRegister(data);
  };

  const handleLogin = async (data: Inputs) => {
    const { email, password } = data;
    await authLogin({ email, password });
  };

  const handleRegister = async (data: Inputs) => {
    const { email, password, fullname, role } = data;
    await authRegister({ email, password, fullname, role });
  };

  useEffect(() => {
    if (isLoginSuccess) {
      console.log(loginData);
      dispatch(login({ user: loginData.user, token: loginData.accessToken }));
      toast.success("Sikeres bejelentkezés!");
      navigate("/");
    }
  }, [isLoginSuccess, dispatch, loginData, navigate]);

  useEffect(() => {
    if (isRegisterSuccess) {
      toast.success("Sikeres regisztráció!");
      navigate("/auth/login");
    }
  }, [isRegisterSuccess, navigate]);

  return (
    <div className="space-y-10">
      <span className="prose">
        <h1>{mode === "register" ? "Regisztráció" : "Bejelentkezés"}</h1>
      </span>
      <Form.Root className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {mode === "register" && (
          <Form.Field {...register("fullname")}>
            <Form.Label>Teljes név</Form.Label>
            <Form.Control asChild>
              <TextField.Root />
            </Form.Control>
          </Form.Field>
        )}
        <Form.Field {...register("email")}>
          <Form.Label>Email cím</Form.Label>
          <Form.Control asChild>
            <TextField.Root />
          </Form.Control>
        </Form.Field>
        <Form.Field {...register("password")}>
          <Form.Label>Jelszó</Form.Label>
          <Form.Control asChild>
            <TextField.Root />
          </Form.Control>
        </Form.Field>
        {mode === "register" && (
          <>
            <Form.Field {...register("confirmPassword")}>
              <Form.Label>Jelszó újra</Form.Label>
              <Form.Control asChild>
                <TextField.Root />
              </Form.Control>
            </Form.Field>
            <Form.Field {...register("role")}>
              <Form.Label>Regisztráció mint</Form.Label>
              <Form.Control asChild>
                <select defaultValue="jobseeker">
                  <option value="jobseeker">Munkavállaló</option>
                  <option value="company">Munkáltató</option>…
                </select>
              </Form.Control>
            </Form.Field>
            {role === "jobseeker" && (
              <Form.Field {...register("experiences")}>
                <Form.Label>Munkatapasztalatok</Form.Label>
                <Form.Control asChild>
                  <TextArea placeholder="Munkahely;Pozíció;Mettől-meddig" />
                </Form.Control>
              </Form.Field>
            )}
          </>
        )}
        <Form.Submit className="mt-10" asChild>
          <Button className="float-right" size="3" variant="soft">
            {mode === "register" ? "Regisztráció" : "Bejelentkezés"}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default AuthForm;
