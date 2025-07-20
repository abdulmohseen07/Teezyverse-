
import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import {CustomButton} from '../components';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motion';

const Home = () => {
  const snap = useSnapshot(state);

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation('left')}>
          <motion.header {...slideAnimation("down")}>
           
          </motion.header>

          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1 className="head-text">
              DRIP<br className="xl:block hidden" />FORGE
              </h1>
            </motion.div>
            <motion.div
              {...headContentAnimation}
              className="flex flex-col gap-5"
            >
              <p className="max-w-md font-normal text-white text-base">
              Transform your vision into reality with our AI-powered 3D customization tool.{" "} The future of creativity starts here.
              </p>

              <CustomButton 
                type="filled"
                title="Customize"
                handleClick={() => state.intro = false}
                customStyles="w-fit px-6 py-3 bg-green-500 text-white font-bold text-sm rounded-full shadow-md shadow-green-700 active:shadow-sm active:translate-y-1 transition-all"


              />
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

export default Home
