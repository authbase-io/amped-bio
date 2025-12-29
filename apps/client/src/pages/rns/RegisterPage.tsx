import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ConfirmRegistrationModal from "@/components/rns/modal/ConfirmRegisterationModal";
import { trimmedDomainName } from "@/utils/rns";
import {
  getDurationUnitFromSeconds,
  getStepForUnit,
  getMaxDurationForUnit,
  formatDuration,
} from "@/utils/rns/timeUtils";
import { useNameAvailability } from "@/hooks/rns/useNameAvailability";
import usePriceFeed from "@/hooks/rns/usePriceFeed";

interface RegisterClientProps {
  name: string;
}

export default function RegisterPage({ name }: RegisterClientProps) {
  const [duration, setDuration] = useState<bigint>(0n);
  const [currencyType, setCurrencyType] = useState<"tREVO" | "USD">("tREVO");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { ethPrice } = usePriceFeed();
  const { isAvailable, price, isLoading, minDuration } = useNameAvailability(name, duration);

  const [durationStep, setDurationStep] = useState<bigint>(0n);
  const [maxDuration, setMaxDuration] = useState<bigint>(0n);

  /** Initialize duration once minDuration is known */
  useEffect(() => {
    if (!minDuration) return;

    setDuration(minDuration);

    const unit = getDurationUnitFromSeconds(Number(minDuration));
    setDurationStep(getStepForUnit(unit));
    setMaxDuration(getMaxDurationForUnit(unit));
  }, [minDuration]);

  const handleDurationChange = (increment: boolean) => {
    if (!minDuration) return;

    if (increment) {
      const next = duration + durationStep;
      if (next <= maxDuration) setDuration(next);
    } else {
      const next = duration - durationStep;
      if (next >= minDuration) setDuration(next);
    }
  };

  const handleNext = () => {
    if (!isAvailable || !duration) {
      toast.error("Name is not available for registration");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  return (
    <div>
      <div className="max-w-[780px] mx-auto px-4">
        <div className="py-4 sm:py-6">
          <div className="w-full overflow-hidden">
            <h1 className="text-3xl sm:text-4xl font-bold break-words hyphens-auto">
              {trimmedDomainName(name)}
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 space-y-6 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Register {trimmedDomainName(name)}
          </h2>

          {/* Duration Selector */}
          <div className="border-2 border-gray-100 rounded-full p-1 sm:p-2 flex items-center justify-between">
            <button
              onClick={() => handleDurationChange(false)}
              disabled={!minDuration || duration <= minDuration}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl sm:text-2xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              −
            </button>

            <div className="text-center flex-1 px-2 sm:px-4">
              <div className="text-2xl sm:text-[32px] leading-[1.1] font-bold text-blue-500">
                {formatDuration(Number(duration))}
              </div>
            </div>

            <button
              onClick={() => handleDurationChange(true)}
              disabled={duration >= maxDuration}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl sm:text-2xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Gas + Currency */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>⛽</span>
              <span>2.79 Gwei</span>
            </div>

            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {(["tREVO", "USD"] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setCurrencyType(type)}
                  className={
                    currencyType === type
                      ? "px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-blue-500 text-white"
                      : "px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gray-50 text-gray-700"
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-1 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm text-gray-500">
              <span>{formatDuration(Number(duration))} registration</span>
              <span>
                {currencyType === "tREVO"
                  ? `${price} tREVO`
                  : `$${(Number(price) * Number(ethPrice)).toFixed(3)}`}
              </span>
            </div>

            <div className="flex justify-between text-xs sm:text-sm text-gray-500">
              <span>Est. network fee</span>
              <span>
                {currencyType === "tREVO"
                  ? "0.0003 tREVO"
                  : `$${(0.0003 * Number(ethPrice)).toFixed(3)}`}
              </span>
            </div>

            <div className="flex justify-between text-sm sm:text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
              <span>Estimated total</span>
              <span>
                {currencyType === "tREVO"
                  ? `${(Number(price) + 0.0003).toFixed(4)} tREVO`
                  : `$${((Number(price) + 0.0003) * Number(ethPrice)).toFixed(3)}`}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleNext}
              disabled={isLoading || !isAvailable || !duration}
              className="w-full sm:w-1/3 btn-bg-blue-500 text-white py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ConfirmRegistrationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        name={name}
        duration={Number(duration)}
        registrationPrice={price as string}
        ethPrice={ethPrice}
      />
    </div>
  );
}
