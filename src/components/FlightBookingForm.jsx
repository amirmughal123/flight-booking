'use client';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import { flightBookingSchema } from '../schemas/flightBookingSchema';
import {
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const flightBookingInitialValues = {
  from: '',
  to: '',
  dates: '',
  class: 'Economy',
  tripType: 'roundtrip',
  miles: false,
  flexible: false,
};

const FlightBookingForm = () => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [subNavActiveTab, setSubNavActiveTab] = useState('flight'); // State for sub-navigation
  const datepickerRef = useRef(null);

  // Handle clicking outside the datepicker to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datepickerRef.current && !datepickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [datepickerRef]);

  const handleDateChange = (ranges, setFieldValue) => {
    const { startDate, endDate } = ranges.selection;

    const formattedDates = startDate
      ? endDate && moment(endDate).isSame(startDate, 'day')
        ? moment(startDate).format('MMM DD')
        : `${moment(startDate).format('MMM DD')} - ${moment(endDate).format('MMM DD')}`
      : null;

    setDateRange([ranges.selection]);
    setFieldValue('dates', formattedDates);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'book':
        return <p>This is my book page content.</p>;
      case 'flightStatus':
        return <p>This is my flight status page content.</p>;
      case 'checkIn':
        return <p>This is my check-in page content.</p>;
      case 'myTrips':
        return <p>This is my trips page content.</p>;
      default:
        return null;
    }
  };

  const renderSubNavContent = (setFieldValue, values) => {
    switch (subNavActiveTab) {
      case 'flight':
        return (
          <>
            {/* Trip Type - Roundtrip / One-way */}
            <div className="grid grid-cols-1 sm:grid-cols-2 text-black md:grid-cols-4 gap-4 mb-4 px-4">
              <label className="flex items-center">
                <Field type="radio" name="tripType" value="roundtrip" className="mr-2" />
                Roundtrip
              </label>
              <label className="flex items-center">
                <Field type="radio" name="tripType" value="one-way" className="mr-2" />
                One-way
              </label>
              <label className="flex items-center">
                <Field type="checkbox" name="miles" className="mr-2" />
                Book with miles
              </label>
              <label className="flex items-center">
                <Field type="checkbox" name="flexible" className="mr-2" />
                Flexible dates
              </label>
            </div>

            {/* From, Arrow Icon, To Input (In one line) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-4 px-4">
              {/* From Input */}
              <div className="col-span-12 sm:col-span-5">
                <label htmlFor="from" className="block text-black">
                  From<span className="text-red-500">*</span>
                </label>
                <Field
                  name="from"
                  type="text"
                  placeholder="Los Angeles LAX"
                  className="mt-1 block w-full text-black placeholder:text-gray-400 px-4 py-2 border rounded-lg"
                />
                <ErrorMessage name="from" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Arrow Icon */}
              <div className="col-span-12 sm:col-span-2 flex justify-center items-center mt-7 arrow-left-right">
                <ArrowsRightLeftIcon className="text-blue-500 h-6 w-6" />
              </div>

              {/* To Input */}
              <div className="col-span-12 sm:col-span-5">
                <label htmlFor="to" className="block text-black">
                  To<span className="text-red-500">*</span>
                </label>
                <Field
                  name="to"
                  type="text"
                  placeholder="Destination"
                  className="mt-1 block w-full text-black placeholder:text-gray-400 px-4 py-2 border rounded-lg"
                />
                <ErrorMessage name="to" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Dates and Travelers Input in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4 px-4">
              <div className="col-span-12 sm:col-span-5" ref={datepickerRef}>
                <label htmlFor="dates" className="block text-black">
                  Dates<span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="mt-1 cursor-pointer w-full px-4 py-2 border rounded-lg flex justify-between items-center"
                >
                  <span className={`${values.dates ? 'text-black' : 'text-gray-400'}`}>
                    {values.dates || 'MMM DD - MMM DD'}
                  </span>
                  <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                </div>
                {showDatePicker && (
                  <div className="absolute z-10 flex justify-center items-center">
                    <DateRangePicker
                      ranges={dateRange}
                      onChange={(ranges) => handleDateChange(ranges, setFieldValue)}
                      moveRangeOnFirstSelection={false}
                      showDateDisplay={false}
                      staticRanges={[]}
                      inputRanges={[]}
                      className="mt-2"
                    />
                  </div>
                )}
                <ErrorMessage name="dates" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="col-span-12 sm:col-span-2 flex justify-center items-center mt-7 arrow-left-right">
              </div>

              {/* Travelers Input */}
              <div className="col-span-12 sm:col-span-5">
                <label htmlFor="travelers" className="block text-black">
                  Travelers
                </label>
                <Field
                  name="travelers"
                  type="text"
                  placeholder="1 Adult"
                  className="mt-1 block w-full text-black placeholder:text-gray-400 px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Class Input */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4 px-4">
              <div className="col-span-12 sm:col-span-5">
                <Field
                  as="select"
                  name="class"
                  className="mt-1 block w-full text-black placeholder:text-gray-400 px-4 py-2 border rounded-lg"
                >
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First Class</option>
                </Field>
                <ErrorMessage name="class" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Advanced Search, Bag Rules & Find Flights Section */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start mb-5 px-4">
              {/* Left side - Advanced Search and Bag Rules */}
              <div>
                <Link href="/" className="text-blue-600 flex items-center">
                  Advanced search
                  <ChevronRightIcon className="text-blue-600 h-6 w-6 ml-1" />
                </Link>
                <p className="text-black text-sm mt-2">(Certificates, multi-city and upgrades)</p>
                <p className="mt-2">
                  <Link href="/" className="text-blue-600 text-sm underline">
                    Changed bag rules
                  </Link>
                  <span className="text-sm text-black"> and </span> <span className='mobile-break'><br /></span>
                  <Link href="/" className="text-blue-600 text-sm underline">
                    fees for optional services
                  </Link>
                </p>
              </div>

              {/* Right side - Find Flights and Travel Credits */}
              <div className="flex flex-col items-end space-y-4 w-full sm:w-auto">
                <button
                  type="submit"
                  className="bg-blue-600 submit-btn w-full sm:w-full text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition duration-300"
                >
                  Find flights
                </button>
                <Link href="/" className="flex items-center w-full justify-center sm:w-full text-blue-600 border border-blue-600 rounded-full px-6 py-2 hover:bg-blue-50 transition duration-300">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Find your travel credits
                </Link>
              </div>
            </div>
          </>
        );
      case 'packages':
        return <div className='text-black flex justify-center items-center'>This is my packages page content.</div>;
      case 'hotel':
        return <div className='text-black flex justify-center items-center'>This is my hotel page content.</div>;
      case 'car':
        return <div className='text-black flex justify-center items-center'>This is my car page content.</div>;
      case 'cruise':
        return <div className='text-black flex justify-center items-center'>This is my cruise page content.</div>;
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={flightBookingInitialValues}
      validationSchema={flightBookingSchema}
      onSubmit={(values) => {
        console.log('Form Data:', values);
      }}
    >
      {({ setFieldValue, values }) => (
        <Form className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto">
          {/* Main Navigation Tabs */}
          <div className="flex flex-col sm:flex-row divide-y sm:divide-x divide-gray-100 justify-center space-x-0 mb-6 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`text-lg font-semibold ${activeTab === 'form' ? 'text-black' : 'text-white bg-gray-800'} flex-1 py-2 text-center`}
            >
              Book
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('flightStatus')}
              className={`text-lg font-semibold ${activeTab === 'flightStatus' ? 'text-black' : 'text-white bg-gray-800'} flex-1 py-2 text-center`}
            >
              Flight status
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('checkIn')}
              className={`text-lg font-semibold ${activeTab === 'checkIn' ? 'text-black' : 'text-white bg-gray-800'} flex-1 py-2 text-center`}
            >
              Check-in
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('myTrips')}
              className={`text-lg font-semibold ${activeTab === 'myTrips' ? 'text-black' : 'text-white bg-gray-800'} flex-1 py-2 text-center`}
            >
              My trips
            </button>
          </div>

          {activeTab === 'form' ?
            <>
              {/* Underline Sub-Navigation */}
              <div className="flex justify-center border-b space-x-6 mb-4 px-4 sm:px-0">
                <button
                  type="button"
                  onClick={() => setSubNavActiveTab('flight')}
                  className={`w-24 sm:w-32 text-center ${subNavActiveTab === 'flight' ? 'border-black text-black font-bold border-b-2' : 'border-transparent hover:border-gray-500 text-gray-500 '} pb-1`}
                >
                  Flight
                </button>
                <button
                  type="button"
                  onClick={() => setSubNavActiveTab('packages')}
                  className={`sm:w-32 text-center ${subNavActiveTab === 'packages' ? 'border-black text-black font-bold border-b-2' : 'border-transparent hover:border-gray-500 text-gray-500 '} pb-1`}
                >
                  Packages
                </button>
                <button
                  type="button"
                  onClick={() => setSubNavActiveTab('hotel')}
                  className={`sm:w-32 text-center ${subNavActiveTab === 'hotel' ? 'border-black text-black font-bold border-b-2' : 'border-transparent hover:border-gray-500 text-gray-500 '} pb-1`}
                >
                  Hotel
                </button>
                <button
                  type="button"
                  onClick={() => setSubNavActiveTab('car')}
                  className={`sm:w-32 text-center ${subNavActiveTab === 'car' ? 'border-black text-black font-bold border-b-2' : 'border-transparent hover:border-gray-500 text-gray-500 '} pb-1`}
                >
                  Car
                </button>
                <button
                  type="button"
                  onClick={() => setSubNavActiveTab('cruise')}
                  className="text-blue-600 font-bold w-24 sm:w-32 text-center flex items-center space-x-2 border-b-2 border-transparent pb-1"
                >
                  <span>Cruise</span>
                  <ArrowTopRightOnSquareIcon className="text-blue-600 h-4 w-4" />
                </button>
              </div>

              {/* Sub-navigation content */}
              <div>{renderSubNavContent(setFieldValue, values)}</div>
            </>
            :
            <div className="px-4 text-black flex justify-center items-center">
              {renderTabContent()}
            </div>
          }
        </Form>
      )}
    </Formik>
  );
};

export default FlightBookingForm;
