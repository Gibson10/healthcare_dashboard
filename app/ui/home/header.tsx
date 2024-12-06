import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className=" bg-custom-gradient relative z-50 h-24 w-full bg-transparent">
      <div className="container mx-auto flex h-full max-w-6xl items-center justify-between px-8">
        <Link href="/">
          <div className="relative inline-block flex h-full items-center font-black leading-none">
            <Image src="/logo.png" alt="Logo" width={100} height={50} />
          </div>
        </Link>
        <nav className="hidden space-x-8 text-white md:flex">
          <Link href="#platform">
            <div className="hover:text-indigo-600">Our Platform</div>
          </Link>
          <Link href="#library">
            <div className="hover:text-indigo-600">Our Film Library</div>
          </Link>
          <Link href="#roadmap">
            <div className="hover:text-indigo-600">Roadmap</div>
          </Link>
          <Link href="#presale">
            <div className="hover:text-indigo-600">Presale</div>
          </Link>
          <Link href="#team">
            <div className="hover:text-indigo-600">Team</div>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
