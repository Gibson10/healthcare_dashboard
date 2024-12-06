import Image from 'next/image';
import illustration from '../public/illustration.png';
import underlayimage from '../public/underlayimage.png';

const SectionOne = () => {
  return (
    <div className="bg-custom-gradient flex min-h-screen items-center justify-center">
      <div className="container mx-auto px-6 md:px-12 xl:px-24">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-1/2">
            <h1 className="text-5xl font-bold leading-tight text-white">
              Tokenized
            </h1>
            <h1 className="text-5xl font-bold leading-tight text-white">
              Entertainment:
            </h1>
            <h1 className="text-5xl font-bold leading-tight text-white">
              Embrace Freedom
            </h1>
            <div className="justify-space-between mt-4 flex">
              <button className="mt-4  bg-blue-800 px-6 py-3 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-700">
                Open Presale
              </button>
              <div className="mt-6 text-xs text-white">
                <span>12</span> Days <span>15</span> Hours <span>33</span> Mins{' '}
                <span>12</span> Secs
              </div>
            </div>
          </div>
          <div className="relative mt-10 flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
            <div
              className="relative"
              style={{ width: '1000px', height: '400px' }}
            >
              <div className="absolute left-10 top-10 h-full w-full">
                <Image
                  src="/underlayimage.png"
                  alt="Underlay Image"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="absolute left-10 top-1/2 h-full w-full -translate-y-1/2 transform">
                <Image
                  src="/illustration.png"
                  alt="Illustration"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
