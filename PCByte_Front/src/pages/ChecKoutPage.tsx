import React, { useState, useEffect } from 'react';
import { ChevronLeft, Truck, CreditCard, ShieldCheck, ChevronDown, MapPin, Info } from 'lucide-react';
import axios from 'axios';

// 1. INTERFAZ CORREGIDA (Incluye clearCart para evitar el error de TS)
interface CheckoutPageProps {
  cart: any[];
  total: number;
  onBack: () => void;
  clearCart: () => void; 
}

const REGIONES_CHILE = [
  { nombre: "Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
  { nombre: "Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"] },
  { nombre: "Antofagasta", comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"] },
  { nombre: "Atacama", comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"] },
  { nombre: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"] },
  { nombre: "Valparaíso", comunas: ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Villa Alemana"] },
  { nombre: "Metropolitana de Santiago", comunas: ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"] },
  { nombre: "Libertador Gral. Bernardo O'Higgins", comunas: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"] },
  { nombre: "Maule", comunas: ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"] },
  { nombre: "Ñuble", comunas: ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Trehuaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"] },
  { nombre: "Biobío", comunas: ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualpén", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"] },
  { nombre: "La Araucanía", comunas: ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"] },
  { nombre: "Los Ríos", comunas: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"] },
  { nombre: "Los Lagos", comunas: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"] },
  { nombre: "Aysén del Gral. Carlos Ibáñez del Campo", comunas: ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"] },
  { nombre: "Magallanes y de la Antártica Chilena", comunas: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Puerto Natales", "Torres del Paine"] }
];

export const CheckoutPage = ({ cart, total, onBack, clearCart }: CheckoutPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', street: '', number: '', apartment: '', city: '', region: '', extraInfo: ''
  });

  useEffect(() => {
    const regionEncontrada = REGIONES_CHILE.find(r => r.nombre === formData.region);
    setComunasDisponibles(regionEncontrada ? regionEncontrada.comunas : []);
    if (formData.region) setFormData(prev => ({ ...prev, city: '' }));
  }, [formData.region]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("https://unrarefied-unpervasive-pandora.ngrok-free.dev/api/payments/create_preference", {
        payer: formData,
        items: cart.map(item => ({ 
          productId: item.product.id, 
          name: item.product.name, 
          price: item.product.price, 
          quantity: item.quantity 
        })),
        total: total
      });

      const targetUrl = response.data.checkoutUrl;

      if (targetUrl) {
        // Vaciamos el carrito justo antes de redirigir
        clearCart();
        window.location.href = targetUrl;
      } else {
        alert("Error: El servidor no devolvió 'checkoutUrl'.");
      }
    } catch (error: any) {
      alert(`Error de Conexión: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full p-2 bg-white border-2 border-slate-200 rounded-lg outline-none focus:border-[#97cf00] focus:ring-2 focus:ring-[#97cf00]/10 font-bold text-[11px] text-slate-800 transition-all appearance-none uppercase placeholder:text-slate-300";
  const labelStyle = "text-[9px] font-black uppercase text-slate-400 mb-0.5 block ml-1 tracking-wider";

  // EL RETURN ES OBLIGATORIO PARA QUE NO DE ERROR DE "VOID"
  return (
    <div className="fixed inset-0 bg-white flex flex-col font-sans text-slate-900 overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="h-[55px] bg-slate-900 px-6 flex justify-between items-center z-50 shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase hover:text-white transition-all">
          <ChevronLeft size={14} /> Volver a la tienda
        </button>
        <h1 className="text-sm font-black italic tracking-tighter uppercase text-white">
          PC<span className="text-[#0066FF]">BYTE</span> 
          <span className="text-[9px] text-slate-500 ml-2 font-bold tracking-widest border-l border-slate-700 pl-2">CHECKOUT_SECURE</span>
        </h1>
        <div className="flex items-center gap-2 text-[#97cf00]">
          <ShieldCheck size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">Pago SSL Activo</span>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
        
        {/* FORMULARIO IZQUIERDA */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 md:px-12 pt-8 pb-4 shrink-0 bg-slate-50">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200">
                <Truck size={24} className="text-[#97cf00]" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">DATOS DE <span className="text-[#0066FF]">DESPACHO</span></h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-12 custom-scrollbar">
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                <div className="md:col-span-6">
                  <label className={labelStyle}>Nombre Completo *</label>
                  <input name="name" className={inputStyle} onChange={handleInputChange} value={formData.name} />
                </div>
                <div className="md:col-span-3">
                  <label className={labelStyle}>Email *</label>
                  <input name="email" className={inputStyle} onChange={handleInputChange} value={formData.email} />
                </div>
                <div className="md:col-span-3">
                  <label className={labelStyle}>Teléfono *</label>
                  <input name="phone" className={inputStyle} onChange={handleInputChange} value={formData.phone} />
                </div>

                <div className="md:col-span-4 mt-2 border-t border-slate-50 pt-4">
                  <label className={labelStyle}>Calle *</label>
                  <input name="street" className={inputStyle} onChange={handleInputChange} value={formData.street} />
                </div>
                <div className="md:col-span-2 mt-2 border-t border-slate-50 pt-4">
                  <label className={labelStyle}>Número *</label>
                  <input name="number" className={inputStyle} onChange={handleInputChange} value={formData.number} />
                </div>

                {/* DEPARTAMENTO Y TORRE */}
                <div className="md:col-span-2">
                  <label className={labelStyle}>Depto</label>
                  <input name="apartment" className={inputStyle} placeholder="OPCIONAL" onChange={handleInputChange} value={formData.apartment} />
                </div>
                <div className="md:col-span-4">
                  <label className={labelStyle}>Torre / Info</label>
                  <input name="extraInfo" className={inputStyle} placeholder="OPCIONAL" onChange={handleInputChange} value={formData.extraInfo} />
                </div>

                <div className="md:col-span-3">
                  <label className={labelStyle}>Región *</label>
                  <div className="relative">
                    <select name="region" className={inputStyle} onChange={handleInputChange} value={formData.region}>
                      <option value="">SELECCIONA REGIÓN</option>
                      {REGIONES_CHILE.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className={labelStyle}>Comuna *</label>
                  <div className="relative">
                    <select name="city" className={inputStyle} onChange={handleInputChange} value={formData.city} disabled={!formData.region}>
                      <option value="">SELECCIONA COMUNA</option>
                      {comunasDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              <button 
                disabled={isLoading || !formData.name || !formData.street || !formData.city}
                onClick={handlePayment}
                className={`w-full mt-8 py-5 rounded-[1.5rem] font-black uppercase italic text-xl transition-all border-b-4 border-black/10 flex items-center justify-center gap-3 shadow-xl
                  ${isLoading ? 'bg-slate-400' : 'bg-[#97cf00] text-black hover:bg-[#a6e400] active:scale-95'}`}
              >
                {isLoading ? "Procesando..." : <><CreditCard size={24} /> Pagar ahora</>}
              </button>
            </div>
          </div>
        </div>

        {/* RESUMEN DERECHA */}
        <div className="w-full lg:w-[420px] bg-white border-l border-slate-200 flex flex-col shrink-0 p-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
              <MapPin size={14} className="text-[#0066FF]" /> Resumen de compra
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <img src={item.product.imageUrl} alt="" className="w-12 h-12 object-cover rounded-xl" />
                  <div className="flex-1 min-w-0 text-[10px] font-black uppercase">
                    <p className="truncate text-slate-700">{item.product.name}</p>
                    <p className="text-[#0066FF]">{item.quantity} UN</p>
                  </div>
                  <span className="text-xs font-black italic text-slate-900">${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] font-black text-slate-400 uppercase">Total</span>
                <span className="text-3xl font-black italic text-[#0066FF] tracking-tighter">${total.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl text-center shadow-lg">
                <p className="text-[9px] font-black uppercase text-white tracking-[0.2em]">PCBYTE CORE v2.9.5</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;