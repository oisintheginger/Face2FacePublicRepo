import { useContext, useState } from 'react';
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import Button from '../../components/UI/Button/Button';

import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthContext } from 'src/contexts/AuthContext';
import { ROUTES } from 'src/configs/routeNames';
import userLoginApi from '../../apis/auth/userLoginApi';
import { toast } from 'react-toastify';
import AuthLayout from 'src/Layout/AuthLayout';
import Input from 'src/components/UI/inputs/Input';
import Checkbox from 'src/components/UI/inputs/Checkbox';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputPrepend from 'src/components/UI/inputs/attachments/InputPrepend';
import EyeAppend from 'src/components/UI/inputs/attachments/EyeAppend';
import { useMutation } from 'react-query';

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  remember_me: z.boolean(),
});

type LoginFormFields = z.infer<typeof loginFormSchema>;

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { setAuth } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const prevRoute = location.state?.from.pathname || ROUTES.HOME;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginFormSchema),
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((s) => {
      return !s;
    });
  };

  //  API Login Mutation
  const { mutate, isLoading } = useMutation(
    (userData: Omit<LoginFormFields, 'remember_me'>) => userLoginApi(userData),
    {
      onSuccess: (data) => {
        const { token, user } = data.data;

        setAuth({ user, token }).then(() => {
          toast.success(`Welcome ${user.name}!`);
          return navigate(prevRoute);
        });
      },
    }
  );

  const submitHandler: SubmitHandler<LoginFormFields> = async (credentials) => {
    const { email, password } = credentials;

    mutate({ email, password });
  };

  return (
    <AuthLayout>
      <h4 className="mb-[5vh] font-bold">Welcome back! Sign In</h4>

      <form onSubmit={handleSubmit(submitHandler)}>
        <Input
          id="email"
          label="Email"
          inputRef={register('email')}
          errors={errors}
          className="pl-10 text-base"
          labelProps={{ className: 'text-base' }}
          autoComplete="email"
        >
          {<InputPrepend Icon={AtSymbolIcon} />}
        </Input>

        <Input
          id="password"
          label="Password"
          type={passwordVisible ? 'text' : 'password'}
          inputRef={register('password')}
          errors={errors}
          className="pl-10 text-base transition-all"
          labelProps={{ className: 'text-base' }}
          autoComplete="current-password"
        >
          <InputPrepend Icon={LockClosedIcon} />
          <EyeAppend
            visible={passwordVisible}
            toggle={togglePasswordVisibility}
          />
        </Input>

        <Checkbox
          inputRef={register('remember_me')}
          id="remember_me"
          label="Remember Me"
          errors={errors}
        />

        <Button
          text="Sign in"
          className="mt-7 h-12 w-full justify-center text-base"
          loading={isLoading}
        />

        <div className="mt-9 flex flex-row items-center justify-between">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="mb-6 font-semibold text-primary-600 hover:opacity-80"
          >
            Forgot your password?
          </Link>
        </div>

        <p>
          Don't have an account?{' '}
          <Link
            to={ROUTES.SIGN_UP}
            className="mb-6 font-semibold text-primary-600 hover:opacity-80"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
