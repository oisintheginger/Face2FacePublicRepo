import { UserIcon } from '@heroicons/react/20/solid';
import { PencilIcon } from '@heroicons/react/24/solid';
import React, { useContext, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import updateProfileApi from 'src/apis/user/updateProfileApi';
import Avatar from 'src/components/UI/Avatar/Avatar';
import Button from 'src/components/UI/Button/Button';
import InputPrepend from 'src/components/UI/inputs/attachments/InputPrepend';
import Input from 'src/components/UI/inputs/Input';
import MyTextArea from 'src/components/UI/inputs/MyTextArea';
import { AuthContext } from 'src/contexts/AuthContext';

type Props = {};

interface ProfileFormFields {
  name: string;
  description: string;
}

const MyProfile = (props: Props) => {
  const { user, setUser } = useContext(AuthContext);

  console.log({ authUser: user });
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<
    { file: File; data: FileReader['result'] }[]
  >([]);

  const [isEditing, setIsEditing] = useState(false);

  const {
    handleSubmit,
    register,
    setValue: setFormValue,
    formState: { errors },
  } = useForm<ProfileFormFields>({
    reValidateMode: 'onChange',
    shouldUnregister: false,
  });

  const { mutate, isLoading } = useMutation(
    (userData: FormData) => updateProfileApi(userData),
    {
      onSuccess: ({ data: { user } }) => {
        console.log({ user });
        setUser(user);
        setIsEditing(false);
        toast.success(`Profile updated successfully`);
      },
    }
  );

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    var fileListArr = !!fileList ? Array.from(fileList) : [];

    fileListArr.forEach((fileItem) => {
      const fileSizeKiloBytes = fileItem.size / 1024;
      const MAX_FILE_SIZE = 2048; // 2MB

      if (fileSizeKiloBytes < MAX_FILE_SIZE) {
        const reader = new FileReader();
        // eslint-disable-next-line no-loop-func

        reader.onload = (readEvt) => {
          setUploadedFile((s) => [
            { file: fileItem, data: readEvt?.target?.result || null },
          ]);
        };
        reader.readAsDataURL(fileItem);
      } else {
        toast.error('File is too large (max. 2MB)');
      }
    });
  };

  const submitHandler: SubmitHandler<ProfileFormFields> = async (data) => {
    const { description, name } = data;

    const formData = new FormData();
    description && formData.append('description', description);
    name && formData.append('name', name);
    uploadedFile[0] && formData.append('avatar', uploadedFile[0].file);

    if (description || name || uploadedFile[0]) {
      mutate(formData);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6 mt-8 flex items-center">
        <h1 className="">Profile</h1>
        {isEditing ? (
          <>
            <Button
              text="Cancel"
              variant="link"
              onClick={() => setIsEditing(false)}
              className="ml-8 px-3 py-2"
            />
            <Button
              loading={isLoading}
              text="Save"
              onClick={handleSubmit(submitHandler)}
              className="ml-8 px-3 py-2"
            />
          </>
        ) : (
          <PencilIcon
            title="Edit Profile"
            role={'button'}
            onClick={() => {
              setIsEditing(true);
              setFormValue('description', user?.description || '');
              setFormValue('name', user?.name || '');
            }}
            className={`relative bottom-2 left-1 inline-block h-7 w-7 cursor-pointer rounded-full bg-thistle p-1 text-gray-700`}
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 flex flex-col justify-center rounded-xl  bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col items-center justify-center">
            <div className="relative text-gray-300">
              <PencilIcon
                title="Change Avatar"
                role={'button'}
                onClick={() => {
                  inputRef.current?.click();
                }}
                className={`${
                  !isEditing && 'pointer-events-none hidden'
                } absolute right-1 -top-2 inline-block h-7 w-7 cursor-pointer rounded-full bg-thistle  p-1 text-primary-600`}
              />
              {!!user?.avatar || uploadedFile[0]?.data ? (
                <div className="inline-block h-24 w-24 overflow-hidden rounded-full bg-gray-100">
                  <img
                    src={(uploadedFile[0]?.data as string) || user?.avatar!}
                    className="h-full w-full object-cover"
                    alt="your avatar"
                  />
                </div>
              ) : (
                <Avatar />
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple={false}
              onChange={onFileUpload}
              hidden
            />
            {isEditing ? (
              <Input
                id="name"
                label={undefined}
                inputRef={register('name', {
                  required: 'Name is required',
                })}
                groupClasses="mb-4"
                errors={errors}
                className="pl-10 text-base"
                labelProps={{ className: 'text-base' }}
                autoComplete="name"
                defaultValue={''}
              >
                <InputPrepend Icon={UserIcon} />
              </Input>
            ) : (
              <p className="mb-2 mt-1 text-center  text-gray-800">
                {user?.name}
              </p>
            )}

            <p className="">{user?.email}</p>
          </div>
        </div>
        <div className="col-span-2 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="h4 mb-5">Bio</h3>
          {isEditing ? (
            <MyTextArea
              id="description"
              label={undefined}
              className=""
              groupClasses="mb-0"
              placeholder="Tell us a little about yourself..."
              inputRef={register('description', {
                minLength: {
                  value: 10,
                  message: 'Bio is too short (Min 10 chars.)',
                },
                maxLength: {
                  value: 500,
                  message: 'Bio is too long (Max 500 chars.)',
                },
              })}
              defaultValue={''}
              errors={errors}
              rows={8}
            />
          ) : user?.description ? (
            <article className="whitespace-pre-line">
              {user?.description}
            </article>
          ) : (
            <article className="text-gray-200">
              Tell us a little about yourself...
            </article>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
