import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [dados, setDados] = useState({ temperatura: 0, umidade: 0, qualidadeAr: 0, chuva: 0 });
  const [carregando, setCarregando] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
  const [toastVisivel, setToastVisivel] = useState(false);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [mostrarPoluentes, setMostrarPoluentes] = useState(false);

  const buscarDados = async () => {
    setCarregando(true);
    try {
      const res = await axios.get("http://ip:5000/api/dados");
      console.log("Resposta do backend:", res.data);
      setDados(res.data);
      setUltimaAtualizacao(new Date().toLocaleTimeString());
      setToastVisivel(true);
      setTimeout(() => setToastVisivel(false), 3000);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
    setCarregando(false);
  };

  useEffect(() => {
    buscarDados();
    const interval = setInterval(buscarDados, 10000);
    return () => clearInterval(interval);
  }, []);

  const converterPPMparaAQI = (ppm) => {
    const faixas = [
      { concMin: 0.0, concMax: 4.4, aqiMin: 0, aqiMax: 50 },
      { concMin: 4.5, concMax: 9.4, aqiMin: 51, aqiMax: 100 },
      { concMin: 9.5, concMax: 12.4, aqiMin: 101, aqiMax: 150 },
      { concMin: 12.5, concMax: 15.4, aqiMin: 151, aqiMax: 200 },
      { concMin: 15.5, concMax: 30.4, aqiMin: 201, aqiMax: 300 },
      { concMin: 30.5, concMax: 40.4, aqiMin: 301, aqiMax: 400 },
      { concMin: 40.5, concMax: 50.4, aqiMin: 401, aqiMax: 500 },
    ];

    for (let faixa of faixas) {
      if (ppm >= faixa.concMin && ppm <= faixa.concMax) {
        return Math.round(((faixa.aqiMax - faixa.aqiMin) / (faixa.concMax - faixa.concMin)) * (ppm - faixa.concMin) + faixa.aqiMin);
      }
    }
    return 500;
  };

  const aqi = converterPPMparaAQI(dados.qualidadeAr);

  const textoQualidadeAr = (aqi) => {
    if (aqi <= 50) return { nivel: "Boa", descricao: "A qualidade do ar está boa." };
    if (aqi <= 100) return { nivel: "Moderada", descricao: "A qualidade do ar entre 51 e 100 não é a ideal, proteja-se." };
    if (aqi <= 150) return { nivel: "Ruim", descricao: "A qualidade do ar é ruim. Evite atividades ao ar livre." };
    return { nivel: "Muito Ruim", descricao: "Qualidade do ar nociva. Permaneça em ambientes fechados." };
  };

  const qualidade = textoQualidadeAr(aqi);

  const cardStyle = {
    borderRadius: 20,
    boxShadow: "0 0 10px rgba(255,255,255,0.1)",
    padding: 20,
    backgroundColor: "#1f1f1f",
    flex: 1,
    minWidth: 200,
    margin: 10,
    textAlign: "center",
    color: "#fff"
  };

  const faixaCor = (valor) => {
    if (valor < 50) return "#2ecc71";
    if (valor < 100) return "#f1c40f";
    if (valor < 150) return "#e67e22";
    return "#e74c3c";
  };

  const getImagemChuva = (valor) => {
    if (valor <= 1363) return "/assets/chuva-forte.png";
    if (valor <= 2728) return "/assets/chuva.png";
    if (valor <= 4094) return "/assets/chuva-fraca.png";
    return "/assets/sem-chuva.png";
  };

  return (
    <div style={{ padding: 30, fontFamily: "Segoe UI", backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ ...cardStyle, flexBasis: "100%", maxWidth: "100%" }}>
            <h2> Temperatura e Umidade</h2>
            <p><strong>Temperatura:</strong> {dados.temperatura} °C</p>
            <p><strong>Umidade:</strong> {dados.umidade} %</p>
          </div>

          <div style={cardStyle}>
            <h2> Qualidade do Ar</h2>
            <div style={{ fontSize: "2.5em", color: faixaCor(aqi), fontWeight: "bold" }}>{aqi}</div>
            <div style={{ fontSize: "1.1em", marginBottom: 8 }}>{qualidade.nivel}</div>
            <p style={{ fontSize: "0.9em", color: "#ccc" }}>{qualidade.descricao}</p>
            <div style={{ marginTop: 15, height: 10, width: "100%", backgroundColor: "#333", borderRadius: 5, position: "relative" }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${Math.min((aqi / 500) * 100, 100)}%`,
                backgroundColor: faixaCor(aqi),
                borderRadius: 5,
                transition: "width 0.3s ease"
              }}></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75em", marginTop: 5, color: "#ccc" }}>
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>500</span>
            </div>

            <button
              onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
              style={{
                marginTop: 12,
                padding: "6px 12px",
                fontSize: "0.9em",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginRight: 6
              }}
            >
              {mostrarDetalhes ? "Ocultar" : "Saiba Mais"}
            </button>
            <button
              onClick={() => setMostrarPoluentes(!mostrarPoluentes)}
              style={{
                marginTop: 12,
                padding: "6px 12px",
                fontSize: "0.9em",
                backgroundColor: "#20c997",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              {mostrarPoluentes ? "Ocultar Poluentes" : "Ver Poluentes"}
            </button>

            {mostrarDetalhes && (
              <div style={{ marginTop: 12, textAlign: "left", fontSize: "0.85em", color: "#ccc" }}>
                <p><strong>Geral:</strong> Há uma quantidade moderada de poluição, mas não há perigo para a saúde.</p>
                <p><strong>Grupos sensíveis:</strong> Recomenda-se menos atividades ao ar livre para indivíduos muito sensíveis.</p>
                <p><strong>Atividade:</strong> Ainda bom para exercícios ao ar livre, mas monitorar mudanças.</p>
              </div>
            )}

            {mostrarPoluentes && (
              <div style={{ marginTop: 16, textAlign: "left", fontSize: "0.85em", color: "#ccc" }}>
                <h4 style={{ marginBottom: 8 }}>Poluentes</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div> PM10 — 10 µg/m³ <br /> Boa</div>
                  <div> PM2.5 — 10 µg/m³ <br /> Boa</div>
                  <div> CO — 0 ppb <br /> Boa</div>
                  <div> O₃ — 27 ppb <br /> Boa</div>
                  <div> SO₂ — 0 ppb <br /> Boa</div>
                  <div> NO₂ — 1 ppb <br /> Boa</div>
                </div>
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h2> Sensor de Chuva</h2>
            <img
              src={getImagemChuva(dados.chuva)}
              alt="Ícone de chuva"
              style={{ width: 150, marginTop: 10 }}
            />
            <p>
              {
                dados.chuva <= 1363 ? "Chuva Forte" :
                dados.chuva <= 2728 ? "Chuva" :
                dados.chuva <= 4094 ? "Chuvisco" :
                "Sem chuva"
              }
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          {ultimaAtualizacao && (
            <p>Última atualização: <strong>{ultimaAtualizacao}</strong></p>
          )}

          <button
            onClick={buscarDados}
            disabled={carregando}
            style={{
              marginTop: 10,
              padding: "12px 20px",
              fontSize: "1em",
              backgroundColor: carregando ? "#6c757d" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s ease"
            }}
          >
            {carregando ? "Atualizando..." : "Atualizar agora"}
          </button>
        </div>
      </div>

      {toastVisivel && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#28a745",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "8px",
          boxShadow: "0 0 12px rgba(0,0,0,0.2)",
          fontSize: "1em"
        }}>
        </div>
      )}
    </div>
  );
}
