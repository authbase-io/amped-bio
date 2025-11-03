import React, {useState, useEffect} from 'react';
import {useNameAvailability} from '@/hooks/rns/useNameAvailability';
import {toast} from 'react-hot-toast';
import ConfirmRegistrationModal from "@/components/rns/modal/ConfirmRegisterationModal";
import {trimmedDomainName} from "@/utils/rns";
import {
    getDurationUnitFromSeconds,
    getStepForUnit,
    getMaxDurationForUnit,
    formatDuration
} from '@/utils/rns/timeUtils';
import usePriceFeed from '@/hooks/rns/usePriceFeed';

interface RegisterClientProps {
    name: string;
}

export default function RegisterClient({ name }: RegisterClientProps) {
    const [duration, setDuration] = useState<bigint>(BigInt(0));
    const [currencyType, setCurrencyType] = useState<'ETH' | 'USD'>('ETH');
    const { isAvailable, price, isLoading, minDuration } = useNameAvailability(name, duration);

    const [durationStep, setDurationStep] = useState<bigint>(BigInt(0));
    const [maxDuration, setMaxDuration] = useState<bigint>(BigInt(0));
    // const [durationUnit, setDurationUnit] = useState<string>('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const {ethPrice} = usePriceFeed();

    // Initialize duration based on minDuration when it's loaded
    useEffect(() => {
        if (minDuration) {
            // Set duration to minDuration initially
            setDuration(minDuration);

            // Determine the most appropriate duration unit
            const minDurationSeconds = Number(minDuration);
            const unit = getDurationUnitFromSeconds(minDurationSeconds);

            // Set the unit for display purposes
            // setDurationUnit(unit);

            // Set the step size for increment/decrement
            setDurationStep(getStepForUnit(unit));

            // Set maximum allowed duration
            setMaxDuration(getMaxDurationForUnit(unit));
        }
    }, [minDuration]);

    // Handle duration change
    const handleDurationChange = (increment: boolean) => {
        if (increment) {
            if (duration + durationStep <= maxDuration) {
                setDuration(duration + durationStep);
            }
        } else {
            const newDuration = duration - durationStep;
            // Don't go below minDuration
            if (minDuration && newDuration >= minDuration) {
                setDuration(newDuration);
            }
        }
    };

    const handleNext = async () => {
        setIsConfirmModalOpen(true);
    };

    const handleConfirmRegistration = async () => {
        try {
            // await register(name, duration, ethPrice);
        } catch (error) {
            toast.error('Registration failed');
            console.error(error);
        }
    };

    return (
        <div>
            <div className="max-w-[780px] mx-auto px-4">
                {/* Title */}
                <div className="py-4 sm:py-6">
                    {/* Use domain-name-container and domain-name classes for responsive handling */}
                    <div className="domain-name-container">
                        <h1 className="domain-name break-words hyphens-auto">{trimmedDomainName(name)}</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="card-panel">
                    <h2 className="section-title">Register {trimmedDomainName(name)}</h2>

                    {/* Duration Selector */}
                    <div className="duration-selector">
                        <button
                            onClick={() => handleDurationChange(false)}
                            disabled={!minDuration || duration <= minDuration}
                            className="btn-circular-minus"
                        >
                            −
                        </button>
                        <div className="text-center flex-1 px-2 sm:px-4">
                            <div className="price-display">
                                {formatDuration(Number(duration))}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDurationChange(true)}
                            disabled={duration >= maxDuration}
                            className="btn-circular-plus"
                        >
                            +
                        </button>
                    </div>

                    {/* Gas and Currency Toggle */}
                    <div className="flex-between">
                        <div className="flex-center gap-1 sm:gap-2">
                            <span className="text-gray-400 text-xs sm:text-sm">⛽</span>
                            <span className="text-gray-400 text-xs sm:text-sm">2.79 Gwei</span>
                        </div>
                        <div className="toggle-container">
                            {(['ETH', 'USD'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setCurrencyType(type)}
                                    className={currencyType === type ? "btn-toggle-active" : "btn-toggle-inactive"}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Display */}
                    <div className="info-box">
                        <div className="price-item">
                            <span>{formatDuration(Number(duration))} registration</span>
                            <span>{currencyType === 'ETH' ? `${price} ETH` : `$${(Number(ethPrice) * Number(price)).toFixed(3)}`}</span>
                        </div>
                        <div className="price-item">
                            <span>Est. network fee</span>
                            <span>{currencyType === 'ETH' ? '0.0003 ETH' :  `$${(0.0003 * Number(ethPrice)).toFixed(3)}`}</span>
                        </div>
                        <div className="price-total">
                            <span>Estimated total</span>
                            <span>
                            {currencyType === 'ETH'
                                ? `${(Number(price) + 0.0003).toFixed(4)} ETH`
                                : `$${(Number(ethPrice) * Number(price) + 0.0003 * Number(ethPrice)).toFixed(3)}`}
                        </span>
                        </div>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleNext}
                            className="w-full sm:w-1/3 btn-primary"
                            disabled={isLoading || !isAvailable || !duration}
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
                onConfirm={handleConfirmRegistration}
            />
        </div>
    );
}
