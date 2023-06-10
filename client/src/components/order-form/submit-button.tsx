import React, { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import { FacadeGood } from "../../app-types";
import { PrimaryButton, Typography, Box } from "../facade-good/facade-good";
import useOrderForm from "./use-order-form";
import $api from "../../http";
import { Order } from "./order-form-provider";

const Errors = {
  WEIGHT_LIMIT_EXCEEDED: "Превышен лимит веса файлов",
  EXCEEDED_QUANTITY: "Превышено максимально количество файлов",
  NO_PHONE: "Не указан телефон для связи",
  NO_EMAIL: "Не указан email",
  NOT_CORRECT_EMAIL: "Не корректный формат email",
};

interface Props {
  clearAllFields: () => void;
}

function SubmitButton({ clearAllFields }: Props) {
  const { state, dispatch } = useOrderForm();
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState<boolean>(true);
  const theme = useTheme() as FacadeGood.CustomTheme;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let tempError: string | null = null;
    let temp = 0;
    let isEmpty = true;

    if (isEmpty) {
      for (const item of state.facades) {
        if (item.height || item.type) {
          isEmpty = false;
          break;
        }
      }
    }
    if (isEmpty) {
      for (const item of state.accessories) {
        if (item.model || item.type || item.height) {
          isEmpty = false;
          break;
        }
      }
    }
    if (isEmpty && state.files.length) {
      isEmpty = false;
    }
    setEmpty(isEmpty);
    const files = state.files || [];
    files.forEach((file) => (temp += Number(file.size)));
    if (temp / (1024 * 1024) > 100) {
      tempError = Errors.WEIGHT_LIMIT_EXCEEDED;
    }
    if (files.length > 10) {
      if (tempError) {
        tempError = `${tempError}. ${Errors.EXCEEDED_QUANTITY}`;
      } else {
        tempError = Errors.EXCEEDED_QUANTITY;
      }
    }
    if (!state.header.mail) {
      if (tempError) {
        tempError = `${tempError}. ${Errors.NO_EMAIL}`;
      } else {
        tempError = Errors.NO_EMAIL;
      }
    }
    if (!state.header.phone) {
      if (tempError) {
        tempError = `${tempError}. ${Errors.NO_PHONE}`;
      } else {
        tempError = Errors.NO_PHONE;
      }
    }

    setError(tempError);
  }, [state]);

  const handleSubmit = () => {
    setLoading(true);
    state.header.material;
    const header = {
      material: state.header?.material?.value || "--",
      model: state.header?.model?.value || "--",
      color: state.header?.color?.value || "--",
      patina: state.header?.patina?.value || "--",
      glossiness: state.header.glossiness?.value || "--",
      drill: state.header.drill?.value || "--",
      thermalseam: state.header.thermalseam?.value || "--",
      roll: state.header.roll?.value || "--",
      note: state.header.note || "",
      date: new Date().toLocaleDateString(),
      mail: state.header.mail || "--",
      phone: state.header.phone || "--",
    };
    const data = {
      header,
      facades: state.facades
        .filter((v) => {
          let chek = false;
          for (const key in v) {
            const item = v[key as keyof Order.Facade];
            if (typeof item === "object") {
              if (item.value) {
                chek = true;
                break;
              }
            } else {
              if (item) {
                chek = true;
                break;
              }
            }
          }
          return chek;
        })
        .map((v) => ({ ...v, type: v.type?.value })),

      accessories: state.accessories
        .filter((v) => {
          let chek = false;
          for (const key in v) {
            const item = v[key as keyof Order.Accessorie];
            if (typeof item === "object") {
              if (item.value) {
                chek = true;
                break;
              }
            } else {
              if (item) {
                chek = true;
                break;
              }
            }
          }
          return chek;
        })
        .map((v) => ({
          ...v,
          model: v.model?.value,
          type: v.type?.value,
        })),
      files: state.files,
    };

    const formData = new FormData();

    formData.append("header", JSON.stringify(data.header));
    formData.append("accessories", JSON.stringify(data.accessories));
    formData.append("facades", JSON.stringify(data.facades));

    data.files.forEach((file) => {
      return formData.append("files", file, file.name);
    });

    $api
      .post("/orders", formData)
      .then((response) => {
        // Обработка успешного ответа
        console.log("response", response);
        setLoading(false);
        resetHandler();
      })
      .catch((error) => {
        // Обработка ошибки
        console.error("error", error);
        setLoading(false);
      });
  };

  const resetHandler = () => {
    dispatch({ type: "RESET" });
    if (typeof clearAllFields === "function") {
      clearAllFields();
    }
  };

  return (
    <Box
      css={{
        paddingTop: 16,
        paddingBottom: 16,
        flexDirection: "column",
        display: "flex",
        justifyContent: "start",
        alignItems: "flex-end",
        minHeight: 100,
        gap: 8,
      }}
    >
      <PrimaryButton
        hidden={empty}
        onClick={() => handleSubmit()}
        loading={loading}
        disabled={Boolean(error)}
      >
        {loading ? "Отправка..." : "Отправить"}
      </PrimaryButton>
      <Typography
        hidden={!Boolean(error) || empty}
        css={{
          ...theme.typography.buttonText,
          textAlign: "right",
          color: theme.colors.danger,
          fontSize: "0.8em",
        }}
      >
        {error}
      </Typography>
      {
        <Typography
          hidden={!loading}
          css={{
            ...theme.typography.buttonText,
            textAlign: "right",
            color: "green",
            fontSize: "0.8em",
          }}
        >
          Выполняеться отправка Вашего заказа. Пожалуйста не закрывайте
          страницу.
        </Typography>
      }
    </Box>
  );
}

export default SubmitButton;