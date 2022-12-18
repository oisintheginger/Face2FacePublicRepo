import { useState } from 'react';
import { AtSymbolIcon } from '@heroicons/react/20/solid';
import Button from '../../components/UI/Button/Button';

import { SubmitHandler, useForm } from 'react-hook-form';
import { ROUTES } from 'src/configs/routeNames';
import { toast } from 'react-toastify';
import AuthLayout from 'src/Layout/AuthLayout';
import Input from 'src/components/UI/inputs/Input';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import forgotPasswordApi from 'src/apis/auth/forgotPasswordApi';

const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
});

type ForgotPasswordFormFields = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  //const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormFields>({
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const submitHandler: SubmitHandler<ForgotPasswordFormFields> = async (
    credentials
  ) => {
    const { email } = credentials;

    setIsLoading(true);
    try {
      const resData = await forgotPasswordApi({
        email,
        appUrl: `${process.env.REACT_APP_APP_URL}/auth/reset-password`,
      });

      toast.success(resData.message);
      //should navigate to verify email page
      // return navigate(prevRoute);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h4 className="mb-[5vh] font-bold">Forgot Password?</h4>

      <p className="mb-6 text-lg font-medium">
        We'll send you an email if you have an account with us.
      </p>

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
          {EmailPrepend}
        </Input>

        <Button
          text="Send Reset Link"
          className="mt-7 h-12 w-full justify-center text-base"
          loading={isLoading}
        />

        <div className="mt-9 flex flex-row items-center justify-between">
          <Link
            to={ROUTES.LOGIN}
            className="mb-6 font-semibold text-primary-600 hover:opacity-80"
          >
            Back to Sign in
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

const EmailPrepend = (
  <div className="form-control-prepend">
    <AtSymbolIcon className="h-4 w-4 text-gray-700" />
  </div>
);
