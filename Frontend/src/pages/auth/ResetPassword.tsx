import { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import Button from '../../components/UI/Button/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ROUTES } from 'src/configs/routeNames';
import { toast } from 'react-toastify';
import AuthLayout from 'src/Layout/AuthLayout';
import Input from 'src/components/UI/inputs/Input';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import resetPasswordApi from 'src/apis/auth/resetPasswordApi';
import EyeAppend from 'src/components/UI/inputs/attachments/EyeAppend';
import InputPrepend from 'src/components/UI/inputs/attachments/InputPrepend';

const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  });

type ResetPasswordFormFields = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const { verificationCode, username } = useParams();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password_dupVisible, setPassword_dupVisible] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormFields>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const submitHandler: SubmitHandler<ResetPasswordFormFields> = async (
    credentials
  ) => {
    const { password } = credentials;

    setIsLoading(true);
    try {
      const resData = await resetPasswordApi({
        password,
        code: verificationCode?.toString() || '',
      });

      toast.success(`Successfully verified, Welcome ${resData.user.name}`);

      //should return user to origin (pass redirectTo param)
      return navigate(ROUTES.HOME);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h4 className="mb-[5vh] font-bold">Reset Password</h4>

      <p className="mb-6 text-lg font-medium">
        Hello {username}, enter and confirm your new password.
      </p>

      <form onSubmit={handleSubmit(submitHandler)}>
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
            toggle={() => setPasswordVisible((s) => !s)}
          />
        </Input>

        <Input
          id="password_confirm"
          label="Confirm Password"
          type={passwordVisible ? 'text' : 'password'}
          inputRef={register('passwordConfirm')}
          errors={errors}
          className="pl-10 text-base transition-all"
          labelProps={{ className: 'text-base' }}
          autoComplete="current-password"
        >
          <InputPrepend Icon={LockClosedIcon} />
          <EyeAppend
            visible={password_dupVisible}
            toggle={() => setPassword_dupVisible((s) => !s)}
          />
        </Input>

        <Button
          text="Send Reset Link"
          className="mt-7 h-12 w-full justify-center text-base"
          loading={isLoading}
        />

        <div className="mt-9 flex flex-row items-center justify-between">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="mb-6 font-semibold text-primary-600 hover:opacity-80"
          >
            Back to Forgot Password?
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
