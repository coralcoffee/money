import { useSettings } from "@/hooks/useSettings";

const Home = () => {
  const settings = useSettings();
  return (
    <div>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  );
};

export default Home;
