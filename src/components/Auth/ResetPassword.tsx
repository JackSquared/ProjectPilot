'use client';

import {useState} from 'react';
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';
import cn from 'classnames';
import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import * as Yup from 'yup';

import {FormData} from '@/lib/types';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';

type ResetPasswordFormData = Pick<FormData, 'email'>;

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ResetPassword = () => {
  const supabase = createClientComponentClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function resetPassword(formData: ResetPasswordFormData) {
    const {error} = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Password reset instructions sent.');
    }
  }

  return (
    <Card>
      <CardHeader>Forgot Password</CardHeader>
      <CardContent>
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={ResetPasswordSchema}
          onSubmit={resetPassword}
        >
          {({errors, touched}) => (
            <Form className="flex flex-col">
              <label htmlFor="email">Email</label>
              <Field
                className={cn('input', 'my-2', errors.email && 'bg-red-50')}
                id="email"
                name="email"
                placeholder="jane@acme.com"
                type="email"
              />
              {errors.email && touched.email ? (
                <div className="text-red-600">{errors.email}</div>
              ) : null}
              <button className="button-inverse w-full" type="submit">
                Send Instructions
              </button>
            </Form>
          )}
        </Formik>
        {errorMsg && <div className="text-center text-red-600">{errorMsg}</div>}
        {successMsg && (
          <div className="text-center text-black">{successMsg}</div>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/sign-in" className="link">
          Remember your password? Sign In.
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ResetPassword;
