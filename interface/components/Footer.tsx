import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Footer = () => {
  const router = useRouter();

  // Exemplo de dados de usuário
  const user = {
    firstName: 'Naila',
    email: 'nailasuely@gmail.com',
  };

  // Definindo o tipo com base na largura da tela
  const type = typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop';

  return (
    <footer className="footer">
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className="text-xl font-bold text-gray-700">
          {user?.firstName[0]}
        </p>
      </div>

      <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
          <h1 className="text-14 truncate text-gray-700 font-semibold">
            {user?.firstName}
          </h1>
          <p className="text-14 truncate font-normal text-gray-600">
            {user?.email}
          </p>
      </div>

      <div className="footer_image">
        <Image src="/icons/logout.svg" width={24} height={24} alt="Logout Icon" />
      </div>
    </footer>
  );
};

export default Footer;
