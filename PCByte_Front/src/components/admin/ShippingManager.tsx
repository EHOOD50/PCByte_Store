import React, {
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { useShippingRates } from "../../hooks/useShippingRates";

import ShippingToolbar from "./shipping/ShippingToolbar";
import ShippingTable from "./shipping/ShippingTable";
import ShippingModal, {
  emptyShippingForm,
  shippingFormToRate,
  shippingRateToForm,
} from "./shipping/ShippingModal";

import ConfirmDeleteModal from "./product/ConfirmDeleteModal";

import type {
  ShippingFormData,
} from "./shipping/ShippingModal";

import type {
  ShippingRate,
} from "../../types/shipping";

const ShippingManager: React.FC = () => {
  const {
    shippingRates,
    loading,
    error,
    loadShippingRates,
    createRate,
    updateRate,
    deleteRate,
    toggleStatus,
  } = useShippingRates();

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    rateToDelete,
    setRateToDelete,
  ] = useState<ShippingRate | null>(
    null
  );

  const [
    formData,
    setFormData,
  ] = useState<ShippingFormData>({
    ...emptyShippingForm,
  });

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const openNewRateModal = () => {
    setFormData({
      ...emptyShippingForm,
    });

    setIsModalOpen(true);
  };

  const openEditRateModal = (
    rate: ShippingRate
  ) => {
    setFormData(
      shippingRateToForm(rate)
    );

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);

    setFormData({
      ...emptyShippingForm,
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error(
        "Debes ingresar un nombre para la tarifa."
      );

      return;
    }

    if (
      formData.price < 0
    ) {
      toast.error(
        "El precio no puede ser negativo."
      );

      return;
    }

    if (
      formData.estimatedMinDays < 0
    ) {
      toast.error(
        "Los días mínimos no pueden ser negativos."
      );

      return;
    }

    if (
      formData.estimatedMaxDays <
      formData.estimatedMinDays
    ) {
      toast.error(
        "Los días máximos deben ser iguales o mayores que los días mínimos."
      );

      return;
    }

    if (
      formData.priority < 0
    ) {
      toast.error(
        "La prioridad no puede ser negativa."
      );

      return;
    }

    setIsSaving(true);

    const payload =
      shippingFormToRate(
        formData
      );

    try {
      if (
        formData.id !== null
      ) {
        await updateRate(
          formData.id,
          payload
        );

        toast.success(
          "Tarifa actualizada correctamente."
        );
      } else {
        await createRate(payload);

        toast.success(
          "Tarifa creada correctamente."
        );
      }

      setIsModalOpen(false);

      setFormData({
        ...emptyShippingForm,
      });
    } catch (requestError: unknown) {
      console.error(
        "Error al guardar la tarifa:",
        requestError
      );

      let message =
        "No se pudo guardar la tarifa.";

      if (
        axios.isAxiosError(
          requestError
        )
      ) {
        const responseData =
          requestError.response?.data;

        if (
          typeof responseData ===
          "string"
        ) {
          message = responseData;
        } else if (
          responseData?.message
        ) {
          message =
            responseData.message;
        }
      }

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus =
    async (
      rate: ShippingRate
    ) => {
      if (rate.id === undefined) {
        return;
      }

      try {
        await toggleStatus(
          rate.id,
          !rate.active
        );

        toast.success(
          rate.active
            ? "Tarifa desactivada."
            : "Tarifa activada."
        );
      } catch (requestError) {
        console.error(
          "Error al cambiar el estado de la tarifa:",
          requestError
        );

        toast.error(
          "No se pudo cambiar el estado de la tarifa."
        );
      }
    };

  const requestDeleteRate = (
    rate: ShippingRate
  ) => {
    setRateToDelete(rate);
  };

  const confirmDeleteRate =
    async () => {
      if (
        !rateToDelete ||
        rateToDelete.id ===
          undefined
      ) {
        return;
      }

      try {
        await deleteRate(
          rateToDelete.id
        );

        toast.success(
          "Tarifa eliminada correctamente."
        );

        setRateToDelete(null);
      } catch (requestError) {
        console.error(
          "Error al eliminar la tarifa:",
          requestError
        );

        toast.error(
          "No se pudo eliminar la tarifa."
        );

        setRateToDelete(null);
      }
    };

  return (
    <div className="space-y-6">
      <ShippingToolbar
        loading={loading}
        onNewRate={
          openNewRateModal
        }
        onRefresh={() => {
          void loadShippingRates();
        }}
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      {loading &&
      shippingRates.length ===
        0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            Cargando tarifas de despacho...
          </p>
        </div>
      ) : (
        <ShippingTable
          rates={
            shippingRates
          }
          onEdit={
            openEditRateModal
          }
          onDelete={
            requestDeleteRate
          }
          onToggleStatus={
            handleToggleStatus
          }
        />
      )}

      <ShippingModal
        isOpen={
          isModalOpen
        }
        formData={
          formData
        }
        onClose={
          closeModal
        }
        onChange={
          setFormData
        }
        onSubmit={
          handleSubmit
        }
      />

      <ConfirmDeleteModal
        isOpen={
          rateToDelete !==
          null
        }
        title="Eliminar tarifa"
        message={
          rateToDelete
            ? `¿Estás seguro de que deseas eliminar la tarifa "${rateToDelete.name}"?`
            : ""
        }
        onCancel={() =>
          setRateToDelete(
            null
          )
        }
        onConfirm={
          confirmDeleteRate
        }
      />
    </div>
  );
};

export default ShippingManager;