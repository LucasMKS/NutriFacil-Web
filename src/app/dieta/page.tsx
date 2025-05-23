"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
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
import { saveResult } from "@/lib/storage";

const TIPOS_DIETA = [
  { label: "Mediterrânea", value: "mediterranea" },
  { label: "Low Carb", value: "lowcarb" },
  { label: "Vegetariana", value: "vegetariana" },
  { label: "Vegana", value: "vegana" },
];

export default function DietaPage() {
  const [tipoDieta, setTipoDieta] = useState("");
  const [restricoes, setRestricoes] = useState<string[]>([]);
  const [novaRestricao, setNovaRestricao] = useState("");
  const [resultado, setResultado] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const adicionarRestricao = () => {
    if (novaRestricao && !restricoes.includes(novaRestricao.toLowerCase())) {
      setRestricoes([...restricoes, novaRestricao.toLowerCase()]);
      setNovaRestricao("");
    }
  };

  const removerRestricao = (item: string) => {
    setRestricoes(restricoes.filter((r) => r !== item));
  };

  const handleRecomendar = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const data = await recomendarDieta(tipoDieta, restricoes);
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <Card className="max-w-md w-full shadow-xl p-6">
          <CardContent>
            <h1 className="text-2xl font-bold mb-6">Recomendação de Dieta</h1>
            <div className="space-y-4">
              <div>
                <Label>Tipo de Dieta</Label>
                <Select value={tipoDieta} onValueChange={setTipoDieta}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo de dieta" />
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
                <Label>Restrições Alimentares</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: nozes"
                    value={novaRestricao}
                    onChange={(e) => setNovaRestricao(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") adicionarRestricao();
                    }}
                  />
                  <Button type="button" onClick={adicionarRestricao}>
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {restricoes.map((item) => (
                    <span
                      key={item}
                      className="bg-gray-200 px-2 py-1 rounded-xl text-sm cursor-pointer"
                      onClick={() => removerRestricao(item)}
                      title="Remover restrição"
                    >
                      {item} ×
                    </span>
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
                      resultado.map((item, idx) => <li key={idx}>{item}</li>)
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
