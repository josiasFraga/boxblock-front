import type { NextPage } from 'next';

import Header from "../components/Header.js";
import Hero from "../components/Hero.js";


const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Hero />
    </>
  );
};

export default Home;
