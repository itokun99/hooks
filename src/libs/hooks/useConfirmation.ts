import { useCallback, useState } from "react";

interface UseConfirmationOption<Data = unknown> {
  onConfirm?: (data?: Data) => void;
  onCancel?: () => void;
  onConfirmAsync?: (data?: Data) => Promise<void>;
  onCancelAsync?: () => Promise<void>;
  onError?: (err: unknown) => void;
}

export function useConfirmation<Data = unknown>(
  option?: UseConfirmationOption<Data>,
) {
  const [state, setState] = useState<{
    data?: Data;
    show?: boolean;
  }>({
    show: false,
  });

  const open = (data?: Data) => {
    setState({ data, show: true });
  };

  const close = () => {
    setState({ show: false });
  };

  const cancel = useCallback(() => {
    if (option?.onCancelAsync) {
      option
        .onCancelAsync()
        .then(() => {
          setState({ show: false });
        })
        .catch((err) => {
          if (option.onError) option.onError(err);
        });
      return;
    }

    if (option?.onCancel) option.onCancel();
    setState({ show: false });
  }, [option]);

  const confirm = useCallback(() => {
    if (option?.onConfirmAsync) {
      option
        .onConfirmAsync(state.data)
        .then(() => {
          setState({ show: false });
        })
        .catch((err) => {
          if (option.onError) option.onError(err);
        });
      return;
    }

    if (option?.onConfirm) option.onConfirm(state.data);
    setState({ show: false });
  }, [option, state.data]);

  const save = (data?: Data) => {
    setState((prev) => ({ ...prev, data }));
  };

  return {
    ...state,
    open,
    close,
    save,
    confirm,
    cancel,
  };
}
