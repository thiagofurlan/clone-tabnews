import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <hr />
      <DatabaseStatus />
    </>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatus = "carregando...";

  if (!isLoading && data) {
    databaseStatus = (
      <ul>
        <li>
          <strong>Versão:</strong> {data.dependencies.database.server_version}
        </li>
        <li>
          <strong>Conexões abertas:</strong>{" "}
          {data.dependencies.database.opened_connections}
        </li>
        <li>
          <strong>Conexões máximas:</strong>{" "}
          {data.dependencies.database.max_connections}
        </li>
      </ul>
    );
  }

  return (
    <div>
      <h4>Banco de dados</h4>
      {databaseStatus}
    </div>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAt = "carregando...";
  if (!isLoading && data) {
    updatedAt = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAt}</div>;
}

export default StatusPage;
