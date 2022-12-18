/* This example requires Tailwind CSS v2.0+ */
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/20/solid';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import MyReactSelect from 'src/components/UI/inputs/MySelect';
import { PAGE_SIZE_OPTIONS } from 'src/configs/selectOptions';

interface PaginationProps {
  setCurrentPage: (size: number) => void;
  lastPage: number;
  currentPage: number;
  setPageSize: (size: number) => void;
  isDataLoading: boolean;
}

const Pagination = (props: PaginationProps) => {
  const { setCurrentPage, currentPage, lastPage, setPageSize, isDataLoading } =
    props;

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<{
    pageSize: { label: string; value: number };
  }>();

  const pageArr = [];

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < lastPage;

  for (let i = currentPage - 2; i <= lastPage; i++) {
    if (i <= 0 || pageArr.length > 4) {
      continue;
    } else if (currentPage > 3 && lastPage - currentPage === 1) {
      if (i - 1 <= 0) {
        continue;
      }
      pageArr.push(i - 1);
      if (i === lastPage) {
        pageArr.push(i);
      }
    } else if (currentPage > 3 && lastPage - currentPage === 0) {
      if (i - 2 <= 0) {
        continue;
      }
      pageArr.push(i - 2);
      if (i === lastPage) {
        pageArr.push(i - 1, i);
      }
    } else {
      pageArr.push(i);
    }
  }

  const items = pageArr.map((page) => {
    const isActive = page === currentPage;

    return (
      <div
        role="button"
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`${
          isActive ? 'pagination-item-active' : 'pagination-item-default'
        }`}
      >
        {page}
      </div>
    );
  });

  const watchPageSize = watch('pageSize');

  useEffect(() => {
    if (watchPageSize) {
      setPageSize(watchPageSize.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPageSize]);

  return (
    <div
      className={`flex items-center justify-between ${
        isDataLoading && 'pointer-events-none'
      }`}
    >
      <p className="mr-5">
        Page <span className="font-medium">{currentPage}</span> of {lastPage}{' '}
      </p>
      <div className="flex flex-1 items-center justify-between sm:hidden">
        <div
          role="button"
          onClick={() => canPreviousPage && setCurrentPage(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </div>
        <div
          role="button"
          onClick={() => canNextPage && setCurrentPage(currentPage + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">10</span> of{' '}
            <span className="font-medium">97</span> results
          </p>
        </div> */}
        <div></div>

        <div className="flex items-center">
          <MyReactSelect
            controllerProps={{
              control: control,
              name: 'pageSize',
              rules: {},
              defaultValue: PAGE_SIZE_OPTIONS[1],
              shouldUnregister: false,
            }}
            id="pageSize"
            errors={errors}
            isClearable={false}
            options={PAGE_SIZE_OPTIONS}
            menuPlacement="auto"
            hideSelectedOptions
            groupClasses="mb-0 mr-4"
            controlClasses="py-0 px-0 !min-h-[1rem] min-w-[5rem]"
            classNamePrefix="pageSelect"
          />
          <nav
            className="relative z-0  inline-flex space-x-2 rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              role="button"
              className={`${
                canPreviousPage
                  ? 'pagination-item-default text-primary'
                  : 'pagination-item-disabled'
              } px-2`}
              onClick={() => canPreviousPage && setCurrentPage(1)}
            >
              <span className="sr-only">First Page</span>
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div
              role="button"
              className={`${
                canPreviousPage
                  ? 'pagination-item-default text-primary'
                  : 'pagination-item-disabled'
              } px-2`}
              onClick={() => canPreviousPage && setCurrentPage(currentPage - 1)}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            {items}
            <div
              role="button"
              className={`${
                canNextPage
                  ? 'pagination-item-default text-primary'
                  : 'pagination-item-disabled'
              } px-2`}
              onClick={() => canNextPage && setCurrentPage(currentPage + 1)}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div
              role="button"
              className={`${
                canNextPage
                  ? 'pagination-item-default text-primary'
                  : 'pagination-item-disabled'
              } px-2`}
              onClick={() => canNextPage && setCurrentPage(lastPage)}
            >
              <span className="sr-only">Last Page</span>
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
