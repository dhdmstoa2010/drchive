export const SHIMMER_HOVER = `
  before:content-['']
  before:absolute
  before:inset-0
  before:[background-image:linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.6)_50%,transparent_65%)]
  before:[background-size:250%_250%]
  before:[background-repeat:no-repeat]
  before:[background-position:-100%_0%]
  before:transition-[background-position]
  before:duration-[1500ms]
  before:ease-out
  before:pointer-events-none
  hover:before:[background-position:100%_0%]
`;
