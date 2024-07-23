'use client';

import { createClient } from '@/utils/supabase/client';
import { showToast } from '@/utils/toastHelper';
import React, { ChangeEvent, FocusEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [passwordConfirm, setpasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const onBlurPassword = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      showToast('error', `비밀번호를 입력하세요`);
    } else if (e.target.value.length < 6) {
      return showToast('error', '비밀번호는 최소 6글자입니다');
    }
  };
  const onBlurPasswordConfirm = () => {
    if (passwordConfirm === '') {
      return showToast('error', `비밀번호를 입력하세요`);
    } else if (password !== passwordConfirm) {
      return showToast('error', `비밀번호가 같지 않습니다`);
    } else if (password === passwordConfirm) {
      return showToast('success', `비밀번호가 일치 합니다`);
    }
  };

  const onBlurNickname = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      return showToast('error', `닉네임을 입력해주세요`);
    } else if (e.target.value.length < 2) {
      return showToast('error', '닉네임은 최소 2글자입니다');
    }
  };

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setpassword(e.target.value);
  };
  const onChangepasswordConfirm = (e: ChangeEvent<HTMLInputElement>) => {
    setpasswordConfirm(e.target.value);
  };
  const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) =>
    setNickname(e.target.value);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
        },
      },
    });
    if (error) {
      showToast('error', error.message);
    } else {
      showToast('success', '회원 가입이 완료되었습니다');
      router.push('/sign-in');
    }
  };

  return (
    <div className="w-full h-dvh mx-auto p-6 border border-gray-300 rounded-md grid place-items-center">
      <h2 className="text-center text-2xl font-semibold mb-6">
        회원가입 페이지
      </h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            이메일:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="이메일을 입력하세요"
            onChange={onChangeEmail}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            비밀번호:
          </label>
          <input
            onBlur={onBlurPassword}
            id="password"
            type="password"
            value={password}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="비밀번호를 입력하세요"
            onChange={onChangePassword}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="confirm-password"
          >
            비밀번호 확인:
          </label>
          <input
            onBlur={onBlurPasswordConfirm}
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="비밀번호를 다시 입력하세요"
            onChange={onChangepasswordConfirm}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="nickname">
            닉네임:
          </label>
          <input
            onBlur={onBlurNickname}
            id="nickname"
            type="text"
            value={nickname}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="닉네임을 입력하세요"
            onChange={onChangeNickname}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-o-500 text-white rounded-md bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;
