import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }

  // Fixing CSS modules
  interface CSSModule {
    [className: string]: string;
  }

  module "*.css" {
    const content: CSSModule;
    export default content;
  }
}

declare module "*.scss";
declare module "*.sass";
declare module "*.module.css";
declare module "*.module.scss";
declare module "*.module.sass";
