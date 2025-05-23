"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getResult, saveResult } from "@/lib/storage";
import { gerarReceitasIA } from "@/lib/api";
import { saoPreferenciasIguais } from "@/lib/utils";

function Badge({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  const colorClasses =
    {
      green:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      yellow:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      gray: "bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-gray-200",
    }[color] ?? "bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-gray-200";
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorClasses}`}
    >
      {children}
    </span>
  );
}

export default function Home() {
  // Dados do usuário
  const [peso, setPeso] = useState<string | null>(null);
  const [altura, setAltura] = useState<string | null>(null);
  const [idade, setIdade] = useState<string | null>(null);
  const [sexo, setSexo] = useState<string | null>(null);
  const [objetivo, setObjetivo] = useState<string | null>(null);
  const [tipoDieta, setTipoDieta] = useState<string | null>(null);
  const [receitas, setReceitas] = useState<any[]>([]);
  const [gerando, setGerando] = useState(false);

  // Últimos resultados das funcionalidades
  const [imc, setImc] = useState<{ imc: number; classificacao: string } | null>(
    null
  );
  const [tmb, setTmb] = useState<number | null>(null);
  const [agua, setAgua] = useState<number | null>(null);
  const [dieta, setDieta] = useState<string[] | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPeso(getResult("peso"));
    setAltura(getResult("altura"));
    setIdade(getResult("idade"));
    setSexo(getResult("sexo"));
    setObjetivo(getResult("objetivo"));
    setTipoDieta(getResult("tipoDieta"));

    setImc(getResult("imc_result"));
    setTmb(getResult("tmb_result"));
    setAgua(getResult("agua_result"));
    setDieta(getResult("dieta_result"));

    setLoading(false);
  }, []);

  useEffect(() => {
    const tipoDieta = getResult("tipoDieta");
    const preferenciasProteinas = getResult("preferenciasProteinas") || [];
    const preferenciasLegumes = getResult("preferenciasLegumes") || [];
    const preferenciasVerduras = getResult("preferenciasVerduras") || [];
    const preferenciasCarboidratos =
      getResult("preferenciasCarboidratos") || [];
    const alergiasIntolerancias = getResult("alergias") || [];

    // Monta o objeto de preferências/dieta usado para gerar receitas
    const inputAtual = {
      tipoDieta,
      preferenciasProteinas,
      preferenciasLegumes,
      preferenciasVerduras,
      preferenciasCarboidratos,
      alergiasIntolerancias,
    };

    // Verifica se existe receitas e entradas salvas no localStorage
    const ultimasPreferencias = getResult("receitas_input") || null;
    const receitasSalvas = getResult("receitas_ia") || [];

    if (
      tipoDieta &&
      saoPreferenciasIguais(inputAtual, ultimasPreferencias) &&
      receitasSalvas.length > 0
    ) {
      // Se está tudo igual ao que já foi salvo, só usa a receita salva
      setReceitas(receitasSalvas);
      setGerando(false);
    } else if (tipoDieta) {
      // Gera uma nova receita e salva
      setGerando(true);
      gerarReceitasIA(inputAtual)
        .then((data) => {
          setReceitas(data);
          saveResult("receitas_ia", data);
          saveResult("receitas_input", inputAtual);
        })
        .catch(() => setReceitas([]))
        .finally(() => setGerando(false));
    }
  }, []);

  // Helpers para display
  function sexoLabel(s: string | null) {
    if (!s) return "";
    return s === "M" ? "Masculino" : s === "F" ? "Feminino" : s;
  }
  function objetivoLabel(o: string | null) {
    if (!o) return "";
    if (o === "emagrecimento") return "Emagrecimento";
    if (o === "hipertrofia") return "Hipertrofia";
    return o.charAt(0).toUpperCase() + o.slice(1);
  }
  function tipoDietaLabel(td: string | null) {
    if (!td) return "";
    if (td === "mediterranea") return "Mediterrânea";
    if (td === "lowcarb") return "Low Carb";
    if (td === "cetogenica") return "Cetogênica";
    if (td === "vegetariana") return "Vegetariana";
    if (td === "vegana") return "Vegana";
    return td.charAt(0).toUpperCase() + td.slice(1);
  }

  return (
    <>
      <Navbar active="/" />
      <main className="flex flex-col items-center justify-center min-h-[100dvh] p-4 bg-fundo-claro dark:bg-verde-escuro">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          Dashboard NutriFácil
        </h1>

        <div className="w-full max-w-4xl flex flex-col gap-6">
          {/* Seus Dados */}
          <Card className="p-2 bg-fundo-verde dark:bg-verde-mais dark:text-white">
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-2 ">
                <span className="font-semibold text-lg">Seus Dados</span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="dark:bg-verde-escuro/50 dark:text-white border-zinc-200 dark:border-green-950 shadow-sm shadow-zinc-900/50"
                >
                  <Link href="/dieta">Editar Dados</Link>
                </Button>
              </div>
              {loading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-base">
                  <div>
                    <b>Peso:</b>{" "}
                    {peso ?? <span className="text-gray-400">Preencher</span>}
                  </div>
                  <div>
                    <b>Altura:</b>{" "}
                    {altura ?? <span className="text-gray-400">Preencher</span>}
                  </div>
                  <div>
                    <b>Idade:</b>{" "}
                    {idade ?? <span className="text-gray-400">Preencher</span>}
                  </div>
                  <div>
                    <b>Sexo:</b>{" "}
                    {sexo ? (
                      sexoLabel(sexo)
                    ) : (
                      <span className="text-gray-400">Preencher</span>
                    )}
                  </div>
                  <div>
                    <b>Objetivo:</b>{" "}
                    {objetivo ? (
                      objetivoLabel(objetivo)
                    ) : (
                      <span className="text-gray-400">Preencher</span>
                    )}
                  </div>
                  <div>
                    <b>Tipo de dieta:</b>{" "}
                    {tipoDieta ? (
                      tipoDietaLabel(tipoDieta)
                    ) : (
                      <span className="text-gray-400">Preencher</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Linha com IMC, TMB e Consumo de Água */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* IMC Card */}
            <Card className="p-2 dark:bg-verde-mais dark:text-white bg-fundo-verde">
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">IMC</span>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="dark:bg-verde-escuro/50 dark:text-white border-zinc-200 dark:border-green-950 shadow-sm shadow-zinc-900/50"
                  >
                    <Link href="/imc">Preencher</Link>
                  </Button>
                </div>
                {loading ? (
                  <Skeleton className="h-12 w-full" />
                ) : imc ? (
                  <div>
                    <div className="text-2xl font-bold">
                      {imc.imc.toFixed(2)}
                    </div>
                    <div className="mt-1">
                      <Badge
                        color={
                          imc.classificacao.includes("Normal")
                            ? "green"
                            : imc.classificacao.includes("Sobrepeso")
                            ? "yellow"
                            : imc.classificacao.includes("Obesidade")
                            ? "red"
                            : imc.classificacao.includes("Abaixo")
                            ? "blue"
                            : "gray"
                        }
                      >
                        {imc.classificacao}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">Preencha seu IMC!</div>
                )}
              </CardContent>
            </Card>

            {/* TMB Card */}
            <Card className="p-2 dark:bg-verde-mais dark:text-white bg-fundo-verde">
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">TMB</span>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="dark:bg-verde-escuro/50 dark:text-white border-zinc-200 dark:border-green-950 shadow-sm shadow-zinc-900/50"
                  >
                    <Link href="/tmb">Preencher</Link>
                  </Button>
                </div>
                {loading ? (
                  <Skeleton className="h-12 w-full" />
                ) : tmb ? (
                  <div>
                    <div className="text-2xl font-bold">
                      {tmb.toFixed(2)} kcal/dia
                    </div>
                    <div className="mt-1">
                      <Badge color="gray">Taxa Metabólica Basal</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">Preencha seu TMB!</div>
                )}
              </CardContent>
            </Card>

            {/* Água Card */}
            <Card className="p-2 dark:bg-verde-mais dark:text-white bg-fundo-verde">
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">Consumo de Água</span>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="dark:bg-verde-escuro/50 dark:text-white border-zinc-200 dark:border-green-950 shadow-sm shadow-zinc-900/50"
                  >
                    <Link href="/agua">Preencher</Link>
                  </Button>
                </div>
                {loading ? (
                  <Skeleton className="h-12 w-full" />
                ) : agua ? (
                  <div>
                    <div className="text-2xl font-bold">
                      {agua.toFixed(2)} litros/dia
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">Preencha seu consumo!</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recomendação de Dieta */}
          <Card className="p-2 dark:bg-verde-mais dark:text-white bg-fundo-verde">
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">
                  Recomendação de Dieta
                </span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="dark:bg-verde-escuro/50 dark:text-white border-zinc-200 dark:border-green-950 shadow-sm shadow-zinc-900/50"
                >
                  <Link href="/dieta">Preencher</Link>
                </Button>
              </div>
              {loading ? (
                <Skeleton className="h-12 w-full" />
              ) : dieta && dieta.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dieta.slice(0, 15).map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-fundo-claro dark:bg-verde-escuro dark:text-white rounded-lg p-2 text-center text-sm font-medium shadow-sm shadow-zinc-900/50 border border-zinc-300 dark:border-green-950"
                    >
                      {item}
                    </div>
                  ))}
                  {dieta.length > 20 && (
                    <div className="bg-fundo-claro dark:bg-verde-escuro dark:text-white rounded-lg p-2 text-center text-sm font-medium shadow-sm shadow-zinc-900/50 border border-zinc-300 dark:border-green-950">
                      e mais...
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">Preencha sua dieta!</div>
              )}
            </CardContent>
          </Card>

          <Card className="p-2 dark:bg-verde-mais dark:text-white bg-fundo-verde">
            <CardContent>
              {gerando ? (
                <div className="text-gray-400 dark:text-white mt-2">
                  Gerando receitas...
                </div>
              ) : receitas.length > 0 ? (
                <div className="mt-4 space-y-2">
                  <div className="font-semibold">
                    Receitas sugeridas pela IA:
                  </div>
                  {receitas.map((r, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-verde-escuro rounded-lg p-4 shadow-sm shadow-zinc-900/50 border border-zinc-300 dark:border-green-950"
                    >
                      <div className="font-bold">{r.nome}</div>
                      <div className="text-xs text-gray-500 dark:text-white/60 mb-1">
                        Ingredientes: {r.ingredientes?.join(", ")}
                      </div>
                      <div className="text-sm whitespace-pre-line">
                        {r.modoPreparo}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
