import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
  // Limpiamos la llave correcta
  localStorage.removeItem('pcbyte_cart_v1');
  
  // Opcional: limpiar la vieja por si acaso
  localStorage.removeItem('cart'); 

  // Notificamos el cambio para que el badge del carrito se ponga en 0
  window.dispatchEvent(new Event('storage'));
}, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!externalReference) {
        setTimeout(() => setLoading(false), 2000);
        return;
      }
      try {
        const res = await axios.get(`http://192.168.100.226:8080/api/payments/order/${externalReference}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        setOrder(res.data);
        if (res.data.status === 'PAGADO' || retryCount >= 5) setLoading(false);
        else setTimeout(() => setRetryCount(prev => prev + 1), 3000);
      } catch (e) {
        if (retryCount < 3) setTimeout(() => setRetryCount(prev => prev + 1), 3000);
        else setLoading(false);
      }
    };
    fetchOrder();
  }, [retryCount, externalReference]);

  if (loading) return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-[100]">
      <Loader2 className="animate-spin text-[#97cf00] mb-4" size={50} />
      <p className="text-white font-black uppercase text-[10px] tracking-widest">Sincronizando con PCBYTE...</p>
    </div>
  );

  return (
    <div className="fixed inset-0 w-full h-full z-[100] flex items-center justify-center overflow-hidden">
      <img src="/fondo2.jpg" className="absolute inset-0 w-full h-full object-cover z-0" alt="bg" />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg p-6 text-center bg-[#111]/90 rounded-[3rem] border-t-8 border-[#97cf00] shadow-2xl">
        <CheckCircle2 size={80} className="text-[#97cf00] mx-auto mb-6" />
        <h1 className="text-3xl font-black italic text-white mb-2 uppercase">¡PAGO EXITOSO!</h1>
        <p className="text-gray-400 font-bold text-[10px] mb-8 uppercase tracking-widest">
          {order?.fullName ? `Gracias ${order.fullName.split(' ')[0]}, procesando envío.` : 'Tu pago ha sido confirmado.'}
        </p>
        <div className="bg-white/5 rounded-2xl p-4 mb-8 text-left border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-gray-500 font-black uppercase">Orden</span>
            <span className="text-[#97cf00] font-mono font-bold">#{externalReference}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-gray-500 font-black uppercase">Estado</span>
            <span className="text-[#0066FF] font-black text-[10px] uppercase">{order?.status || 'PAGADO'}</span>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="w-full py-5 bg-[#97cf00] text-black rounded-2xl font-black uppercase italic hover:bg-white transition-all flex items-center justify-center gap-2">
          VOLVER AL INICIO <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;