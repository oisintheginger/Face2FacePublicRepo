import { useContext, useState } from 'react';
import {
  AtSymbolIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/20/solid';
import Button from '../../components/UI/Button/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthContext } from 'src/contexts/AuthContext';
import { ROUTES } from 'src/configs/routeNames';
import { toast } from 'react-toastify';
import AuthLayout from 'src/Layout/AuthLayout';
import Input from 'src/components/UI/inputs/Input';
import Checkbox from 'src/components/UI/inputs/Checkbox';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import userRegisterApi from 'src/apis/auth/userRegisterApi';
import EyeAppend from 'src/components/UI/inputs/attachments/EyeAppend';
import InputPrepend from 'src/components/UI/inputs/attachments/InputPrepend';
import { useMutation } from 'react-query';

const registerFormSchema = z.object({
  name: z.string().min(1, 'Full name is required').max(100),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  agree_terms: z.boolean(),
});

type RegisterFormFields = z.infer<typeof registerFormSchema>;

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { setAuth } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const prevRoute = location.state?.from.pathname || ROUTES.HOME;

  const { mutate, isLoading } = useMutation(
    (userData: FormData) => userRegisterApi(userData),
    {
      onSuccess(data) {
        console.log(data, 'onSuccess data');
        const { user, token } = data.data;

        setAuth({ user, token }).then(() => {
          toast.success(`Welcome ${user.name}!`);
          return navigate(prevRoute);
        });
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormFields>({
    resolver: zodResolver(registerFormSchema),
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((s) => {
      return !s;
    });
  };

  const submitHandler: SubmitHandler<RegisterFormFields> = async (
    credentials
  ) => {
    const { name, email, password } = credentials;

    const formData = new FormData();

    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('passwordConfirm', password);

    mutate(formData);
  };

  return (
    <AuthLayout>
      <h4 className="mb-[3vh] font-bold">We'd love to have you, Sign up</h4>

      <form onSubmit={handleSubmit(submitHandler)}>
        <Input
          id="name"
          label="Full Name"
          inputRef={register('name')}
          errors={errors}
          className="pl-10 text-base"
          labelProps={{ className: 'text-base' }}
          autoComplete="name"
        >
          <InputPrepend Icon={UserIcon} />
        </Input>
        <Input
          id="email"
          label="Email"
          inputRef={register('email')}
          errors={errors}
          className="pl-10 text-base"
          labelProps={{ className: 'text-base' }}
          autoComplete="email"
        >
          <InputPrepend Icon={AtSymbolIcon} />
        </Input>

        <Input
          id="password"
          label="Password"
          type={passwordVisible ? 'text' : 'password'}
          inputRef={register('password')}
          errors={errors}
          className="pl-10 text-base transition-all"
          labelProps={{ className: 'text-base' }}
          autoComplete="new-password"
        >
          <InputPrepend Icon={LockClosedIcon} />
          <EyeAppend
            visible={passwordVisible}
            toggle={togglePasswordVisibility}
          />
        </Input>

        <Checkbox
          inputRef={register('agree_terms', {
            required: 'Please check this',
          })}
          id="remember_me"
          label="Remember Me"
          errors={errors}
        />

        <Button
          text="Sign up"
          className="mt-7 h-12 w-full justify-center text-base"
          loading={isLoading}
        />

        <p className="mt-6">
          Already signed up?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-primary-600 hover:opacity-80"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
