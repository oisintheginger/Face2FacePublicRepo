import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MinusIcon } from '@heroicons/react/24/solid';

interface MediaPreviewProps {
  photos: Array<string | ArrayBuffer | null>;
  removeHandler: Function;
  productPhotoProgress: any;
}

const MediaPreview: React.FC<MediaPreviewProps> = (props) => {
  const { photos, removeHandler } = props;

  return (
    <div className="">
      <h6 className="mb-2">Preview</h6>
      <div className="relative inset-0 flex w-full snap-x gap-6 overflow-x-auto rounded-xl border border-black/5 py-8 pb-14 dark:border-white/5">
        {photos?.map((data, index) => {
          return (
            <div
              key={index}
              className="relative shrink-0 snap-center first:ml-8 last:mr-8"
            >
              <div
                role={'button'}
                onClick={() => removeHandler(index)}
                className="absolute -top-2 -right-2 flex items-center justify-center rounded-full border border-red-500 bg-white p-1"
              >
                <MinusIcon
                  className="h-3 w-3 text-red-600"
                  stroke="red"
                  strokeWidth="3px"
                />
              </div>
              <img
                className="h-40 w-auto shrink-0 rounded-lg bg-white object-contain shadow-xl"
                src={data as string}
                alt="upload preview"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MediaPreview;
