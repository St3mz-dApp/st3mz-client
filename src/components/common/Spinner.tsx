export const Spinner = ({ message }: { message?: string }): JSX.Element => {
  return (
    <div className="flex items-center">
      <img src="/images/logo_512.png" className="h-10 animate-rotate"></img>
      {message && <span className="ml-2 text-xl">{message}</span>}
    </div>
  );
};
