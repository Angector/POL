import { useToast } from '../layout/ToastHost';

export function SosButton() {
  const toast = useToast();

  const handleClick = () => {
    toast.show({
      message: 'درخواست کمک ارسال شد. (فاز ۷)',
      type: 'info',
    });
  };

  return (
    <button
      onClick={handleClick}
      className="w-full py-2 bg-command-crimson text-white font-bold rounded hover:brightness-110 transition-all"
      aria-label="کمک فوری از همرزمان"
    >
      🆘 کمک فوری از همرزمان
    </button>
  );
}
