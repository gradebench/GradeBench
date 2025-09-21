import { H2, Lead } from "@gb/ui/src/components/ui/typography";
import Link from "next/link";
import { ThemedImage } from "@/features/site/components/home/clients/backedby";

export const BackedbySection = () => {
	return (
		<section className="px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl text-center">
				<div className="mb-16 text-center">
					<H2 className="mb-6" data-testid="headline">
						Accelerated by the Best in Tech
					</H2>
					<Lead
						className="mx-auto max-w-4xl leading-relaxed"
						data-testid="text"
					>
						We partner with industry-leading technology companies to build the
						future of education. Their expertise and infrastructure empower us
						to deliver powerful, scalable solutions to educators worldwide.
					</Lead>
				</div>
				<div className="flex flex-col items-stretch justify-center space-y-8 md:flex-row md:height-full md:space-y-0 md:space-x-8">
					<Link
						className="grid flex-1 place-items-center"
						href="https://www.microsoft.com/en-in/startups"
						target="_blank"
					>
						<ThemedImage
							lightSrc="/assets/Microsoft-for-Startups.jpg"
							darkSrc="/assets/microsoft-startup (2).png"
							alt="Microsoft Logo"
							width={200}
							height={200}
						/>
					</Link>
					<Link
						className="grid flex-1 place-items-center"
						href="https://aws.amazon.com/startups"
						target="_blank"
					>
						<ThemedImage
							lightSrc="/assets/aws.svg"
							darkSrc="/assets/aws-startup (1).png"
							alt="AWS Logo"
							width={200}
							height={200}
						/>
					</Link>
					<Link
						className="grid flex-1 place-items-center"
						href="https://startup.google.com/"
						target="_blank"
					>
						<ThemedImage
							lightSrc="/assets/google_for_startups_logo-light.svg"
							darkSrc="/assets/Google_for_Startups_logo.svg"
							alt="Google Logo"
							width={300}
							height={300}
						/>
					</Link>
					<Link
						className="grid flex-1 place-items-center"
						href="https://www.nvidia.com/en-in/startups/"
						target="_blank"
					>
						<ThemedImage
							lightSrc="/assets/nvidia-inception-program.jpg"
							darkSrc="/assets/nvidia-inception (1).png"
							alt="Nvidia Logo"
							width={200}
							height={200}
						/>
					</Link>
				</div>
			</div>
		</section>
	);
};
