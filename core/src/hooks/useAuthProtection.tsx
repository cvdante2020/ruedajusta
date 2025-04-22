import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function useAuthProtection() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (!session || error) {
        router.push("/admin/login");
        return;
      }

      setAutenticado(true);
      setVerificando(false);
    };

    verificarSesion();
  }, [router]);

  return { autenticado, verificando };
}
