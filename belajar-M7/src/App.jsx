import { PengaduanWarga } from "./components/PengaduanWarga";

function App() {
  return (
    <section className="container mx-auto py-10 min-w-96 font-mono capitalize">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold underline text-center mb-9">
          CRUD Pengaduan Warga
        </h1>
        <PengaduanWarga/>
      </div>
    </section>
  );
}

export default App;
