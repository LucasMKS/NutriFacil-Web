"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { MultiSelect } from "@/components/MultiSelect";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { recomendarDieta } from "@/lib/api";
import { saveResult, getResult } from "@/lib/storage";

// Constantes de opções
const TIPOS_DIETA = [
  { label: "Mediterrânea", value: "mediterranea" },
  { label: "Low Carb", value: "lowcarb" },
  { label: "Cetogênica", value: "cetogenica" },
  { label: "Vegetariana", value: "vegetariana" },
];
const OBJETIVOS = [
  { label: "Emagrecimento", value: "emagrecimento" },
  { label: "Hipertrofia", value: "hipertrofia" },
];
const ALERGIAS = [
  "Nenhuma",
  "Lactose",
  "Glúten",
  "Proteína do leite",
  "Ovo",
  "Frutos do mar",
];

const PROTEINAS_OPCOES = [
  "Frango",
  "Peixe",
  "Ovos",
  "Tofu",
  "Carne magra",
  "Iogurte",
  "Grão de bico",
  "Feijão",
  "Lentilha",
  "Whey Protein",
];
const LEGUMES_OPCOES = [
  "Cenoura",
  "Abobrinha",
  "Berinjela",
  "Vagem",
  "Beterraba",
];
const VERDURAS_OPCOES = ["Alface", "Rúcula", "Espinafre", "Couve", "Agrião"];
const CARBOIDRATOS_OPCOES = [
  "Arroz integral",
  "Macarrão integral",
  "Quinoa",
  "Batata-doce",
];

function getLocalNumber(key: string) {
  const value = getResult(key);
  return value ? String(value) : "";
}

export default function DietaPage() {
  // Repetidos
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  // Novos
  const [tipoDieta, setTipoDieta] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [preferenciasProteinas, setPreferenciasProteinas] = useState<string[]>(
    []
  );
  const [preferenciasLegumes, setPreferenciasLegumes] = useState<string[]>([]);
  const [preferenciasVerduras, setPreferenciasVerduras] = useState<string[]>(
    []
  );
  const [preferenciasCarboidratos, setPreferenciasCarboidratos] = useState<
    string[]
  >([]);
  const [alergias, setAlergias] = useState<string[]>([]);
  // Resultado
  const [resultado, setResultado] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Carrega do localStorage ao iniciar
  useEffect(() => {
    setPeso(getLocalNumber("peso"));
    setAltura(
      getResult("altura") ? (Number(getResult("altura")) * 100).toString() : ""
    );
    setIdade(getLocalNumber("idade"));
    setSexo(getResult("sexo") || "");
    setTipoDieta(getResult("tipoDieta") || "");
    setObjetivo(getResult("objetivo") || "");
    setPreferenciasProteinas(getResult("preferenciasProteinas") || []);
    setPreferenciasLegumes(getResult("preferenciasLegumes") || []);
    setPreferenciasVerduras(getResult("preferenciasVerduras") || []);
    setPreferenciasCarboidratos(getResult("preferenciasCarboidratos") || []);
    setAlergias(getResult("alergias") || []);
    setResultado(getResult("dieta_result") || null);
  }, []);

  const handleRecomendar = async () => {
    setLoading(true);
    setResultado(null);
    // Salva campos repetidos
    saveResult("peso", peso);
    saveResult("altura", altura);
    saveResult("idade", idade);
    saveResult("sexo", sexo);
    saveResult("objetivo", objetivo);
    saveResult("tipoDieta", tipoDieta);
    // Salva preferências
    saveResult("preferenciasProteinas", preferenciasProteinas);
    saveResult("preferenciasLegumes", preferenciasLegumes);
    saveResult("preferenciasVerduras", preferenciasVerduras);
    saveResult("preferenciasCarboidratos", preferenciasCarboidratos);
    saveResult("alergias", alergias);
    // Valida campos
    if (!peso || !altura || !idade || !sexo || !tipoDieta || !objetivo) {
      alert("Preencha todos os campos obrigatórios!");
      setLoading(false);
      return;
    }
    try {
      const req = {
        tipoDieta,
        peso: Number(peso),
        altura: Number(altura),
        idade: Number(idade),
        sexo,
        objetivo,
        preferenciasProteinas,
        preferenciasLegumes,
        preferenciasVerduras,
        preferenciasCarboidratos,
        alergiasIntolerancias: alergias,
      };
      const data = await recomendarDieta(req);
      setResultado(data.recomendacoes);
      saveResult("dieta_result", data.recomendacoes);
    } catch (err) {
      alert("Erro ao conectar com o backend!");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar active="/dieta" />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-fundo-claro dark:bg-verde-escuro">
        <Card className="max-w-xl w-full shadow-md shadow-zinc-900 p-6 dark:bg-verde-mais bg-fundo-verde">
          <CardContent>
            <h1 className="text-2xl font-bold mb-6">Recomendação de Dieta</h1>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800"
                  />
                </div>
                <div>
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    className="dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800"
                  />
                </div>
                <div>
                  <Label htmlFor="idade">Idade (anos)</Label>
                  <Input
                    id="idade"
                    type="number"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    className="dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800"
                  />
                </div>
                <div>
                  <Label>Sexo</Label>
                  <Select value={sexo} onValueChange={setSexo}>
                    <SelectTrigger className="w-full dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Dieta</Label>
                  <Select value={tipoDieta} onValueChange={setTipoDieta}>
                    <SelectTrigger className="w-full dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_DIETA.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Objetivo</Label>
                  <Select value={objetivo} onValueChange={setObjetivo}>
                    <SelectTrigger className="w-full dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {OBJETIVOS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Preferências por categoria */}
              <div className="grid grid-cols-2 gap-4">
                <MultiSelect
                  label="Preferências de Proteínas"
                  options={PROTEINAS_OPCOES}
                  selected={preferenciasProteinas}
                  setSelected={setPreferenciasProteinas}
                  placeholder="Escolha proteínas"
                />
                <MultiSelect
                  label="Preferências de Legumes"
                  options={LEGUMES_OPCOES}
                  selected={preferenciasLegumes}
                  setSelected={setPreferenciasLegumes}
                  placeholder="Escolha legumes"
                />
                <MultiSelect
                  label="Preferências de Verduras"
                  options={VERDURAS_OPCOES}
                  selected={preferenciasVerduras}
                  setSelected={setPreferenciasVerduras}
                  placeholder="Escolha verduras"
                />
                <MultiSelect
                  label="Preferências de Carboidratos"
                  options={CARBOIDRATOS_OPCOES}
                  selected={preferenciasCarboidratos}
                  setSelected={setPreferenciasCarboidratos}
                  placeholder="Escolha carboidratos"
                />
              </div>
              {/* Alergias/Intolerâncias */}
              <div>
                <Label>Alergias/Intolerâncias</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ALERGIAS.map((op) => (
                    <Button
                      key={op}
                      type="button"
                      variant={alergias.includes(op) ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setAlergias((prev) =>
                          prev.includes(op)
                            ? prev.filter((a) => a !== op)
                            : op === "Nenhuma"
                            ? ["Nenhuma"]
                            : prev.filter((a) => a !== "Nenhuma").concat(op)
                        )
                      }
                    >
                      {op}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleRecomendar}
                disabled={loading || !tipoDieta}
                className="w-full"
              >
                {loading ? "Calculando..." : "Obter recomendações"}
              </Button>
              {resultado && (
                <div className="mt-4 ">
                  <div className="font-semibold mb-2">
                    Alimentos recomendados:
                  </div>
                  <ul className="list-disc list-inside">
                    {resultado.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2">
                        {resultado.slice(0, 20).map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-fundo-claro dark:bg-verde-escuro dark:text-white rounded-lg p-2 text-center text-sm font-medium shadow-sm shadow-zinc-900/50 border border-zinc-300 dark:border-green-950"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <li>Nenhum alimento recomendado.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
