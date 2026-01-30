
import React from 'react';
import { Doctor, Hospital, Specialty } from './types';

export const DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Mahfuzur Rahman',
    specialty: 'Cardiology',
    hospitalId: 'h1',
    hospitalName: 'Sylhet MAG Osmani Medical College',
    image: 'https://picsum.photos/seed/doc1/400/400',
    rating: 4.8,
    fee: 800,
    availability: ['Mon', 'Wed', 'Fri'],
    bio: 'Senior consultant with 15 years of experience in interventional cardiology.',
    contact: '01711-XXXXXX'
  },
  {
    id: 'd2',
    name: 'Dr. Syeda Nusrat Jahan',
    specialty: 'Pediatrics',
    hospitalId: 'h2',
    hospitalName: 'Ibn Sina Hospital Sylhet',
    image: 'https://picsum.photos/seed/doc2/400/400',
    rating: 4.9,
    fee: 600,
    availability: ['Sat', 'Sun', 'Tue'],
    bio: 'Specialist in child health and neonatology.',
    contact: '01712-XXXXXX'
  },
  {
    id: 'd3',
    name: 'Dr. Ahmed Tanveer',
    specialty: 'Neurology',
    hospitalId: 'h1',
    hospitalName: 'Sylhet MAG Osmani Medical College',
    image: 'https://picsum.photos/seed/doc3/400/400',
    rating: 4.7,
    fee: 1000,
    availability: ['Mon', 'Tue', 'Thu'],
    bio: 'Expert in neurodegenerative disorders and stroke management.',
    contact: '01713-XXXXXX'
  },
  {
    id: 'd4',
    name: 'Dr. Fahmida Sultana',
    specialty: 'Gynecology',
    hospitalId: 'h3',
    hospitalName: 'Mount Adora Hospital',
    image: 'https://picsum.photos/seed/doc4/400/400',
    rating: 4.6,
    fee: 700,
    availability: ['Wed', 'Thu', 'Fri'],
    bio: 'Specialized in maternal-fetal medicine and reproductive health.',
    contact: '01714-XXXXXX'
  }
];

export const HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'Sylhet MAG Osmani Medical College',
    address: 'Kajir Bazar Rd, Sylhet 3100',
    location: 'Zindabazar',
    image: 'https://picsum.photos/seed/hosp1/800/400',
    services: ['Emergency', 'Surgery', 'Diagnostic Center', 'Pharmacy'],
    contact: '0821-713200',
    rating: 4.5
  },
  {
    id: 'h2',
    name: 'Ibn Sina Hospital Sylhet',
    address: 'Subhanighat, Sylhet',
    location: 'Subhanighat',
    image: 'https://picsum.photos/seed/hosp2/800/400',
    services: ['ICU', 'Dialysis', 'Maternity', 'Pathology'],
    contact: '0821-724321',
    rating: 4.7
  },
  {
    id: 'h3',
    name: 'Mount Adora Hospital',
    address: 'Akhalia, Sylhet-Sunamganj Road',
    location: 'Akhalia',
    image: 'https://picsum.photos/seed/hosp3/800/400',
    services: ['Orthopedics', 'Dental Care', 'Optical Center'],
    contact: '0821-721234',
    rating: 4.8
  }
];

export const SPECIALTIES: Specialty[] = [
  'Cardiology', 'Neurology', 'Pediatrics', 'Gynecology', 'Orthopedics', 'Medicine', 'Dermatology', 'ENT'
];

export const TRANSLATIONS = {
  en: {
    heroTitle: 'Sylhet Health Care Clinic',
    heroSubtitle: 'Connecting you with the best doctors and hospitals in Sylhet.',
    findDoctor: 'Find a Doctor',
    findHospital: 'Find a Hospital',
    searchPlaceholder: 'Search by specialty, doctor or hospital...',
    bookNow: 'Book Now',
    verified: 'Verified',
    appointment: 'Appointment',
    specialties: 'Specialties',
    login: 'Login',
    register: 'Register',
    about: 'About',
    contact: 'Contact',
    emergency: 'Emergency Call: 01711-XXXXXX',
    healthAssistant: 'Health Assistant',
    askAnything: 'Ask me anything about your health...',
    bKash: 'Pay with bKash',
    nagad: 'Pay with Nagad'
  },
  bn: {
    heroTitle: 'সিলেট হেলথ কেয়ার ক্লিনিক',
    heroSubtitle: 'সিলেটের সেরা ডাক্তার এবং হাসপাতালের সাথে আপনাকে সংযুক্ত করছি।',
    findDoctor: 'ডাক্তার খুঁজুন',
    findHospital: 'হাসপাতাল খুঁজুন',
    searchPlaceholder: 'স্পেশালিটি, ডাক্তার বা হাসপাতাল দিয়ে খুঁজুন...',
    bookNow: 'বুক করুন',
    verified: 'যাচাইকৃত',
    appointment: 'অ্যাপয়েন্টমেন্ট',
    specialties: 'বিশেষত্ব',
    login: 'লগইন',
    register: 'রেজিস্টার',
    about: 'সম্পর্কে',
    contact: 'যোগাযোগ',
    emergency: 'জরুরী কল: ০১৭১১-XXXXXX',
    healthAssistant: 'স্বাস্থ্য সহকারী',
    askAnything: 'আপনার স্বাস্থ্য সম্পর্কে জিজ্ঞাসা করুন...',
    bKash: 'বিকাশ দিয়ে পেমেন্ট করুন',
    nagad: 'নগদ দিয়ে পেমেন্ট করুন'
  }
};
