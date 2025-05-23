"use client";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { getResult } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [imc, setImc] = useState<{ imc: number; classificacao: string } | null>(
    null
  );
  const [tmb, setTmb] = useState<number | null>(null);
  const [agua, setAgua] = useState<number | null>(null);
  const [dieta, setDieta] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setImc(getResult("imc_result"));
    setTmb(getResult("tmb_result"));
    setAgua(getResult("agua_result"));
    setDieta(getResult("dieta_result"));
    setLoading(false);
  }, []);

  return (
    <>
      <Navbar active="/" />
      <main className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8">Dashboard NutriFácil</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* IMC Card */}
          <Card className="p-2">
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">IMC</span>
                <Button asChild variant="outline" size="sm">
                  <Link href="/imc">Preencher</Link>
                </Button>
              </div>
              {loading ? (
                <Skeleton className="h-12 w-full" />
              ) : imc ? (
                <div>
                  <div className="text-2xl font-bold">{imc.imc.toFixed(2)}</div>
                  <div className="text-base">{imc.classificacao}</div>
                </div>
              ) : (
                <div className="text-gray-400">Preencha seu IMC!</div>
              )}
            </CardContent>
          </Card>
          {/* TMB Card */}
          <Card className="p-2">
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">TMB</span>
                <Button asChild variant="outline" size="sm">
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
                </div>
              ) : (
                <div className="text-gray-400">Preencha seu TMB!</div>
              )}
            </CardContent>
          </Card>
          {/* Água Card */}
          <Card className="p-2">
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">Consumo de Água</span>
                <Button asChild variant="outline" size="sm">
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
          {/* Dieta Card */}
          <Card className="p-2">
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">
                  Recomendação de Dieta
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dieta">Preencher</Link>
                </Button>
              </div>
              {loading ? (
                <Skeleton className="h-12 w-full" />
              ) : dieta && dieta.length > 0 ? (
                <ul className="list-disc list-inside">
                  {dieta.slice(0, 5).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                  {dieta.length > 5 && <li>e mais...</li>}
                </ul>
              ) : (
                <div className="text-gray-400">Preencha sua dieta!</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
