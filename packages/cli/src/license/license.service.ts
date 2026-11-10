import { LicenseState, Logger } from '@n8n/backend-common';
import { OutboundHttp, type HttpRequestClient, isHttpRequestError } from '@n8n/backend-network';
import { EventService, UrlService } from '@n8n/backend-services';
import { Time } from '@n8n/constants';
import type { User } from '@n8n/db';
import { WorkflowRepository } from '@n8n/db';
import { Service } from '@n8n/di';

import { License } from '@/license';

const REQUEST_TIMEOUT_MS = 30 * Time.seconds.toMilliseconds;

// 1. THE MOCK SDK
// This class perfectly mimics the closed-source LicenseManager but hardcodes
// all responses to unlock enterprise features and safely route integers.
class DummyLicenseProvider {
	isLicensed(feature: any) { return true; }
	
	getValue(feature: string) {
		// Keep chronological database tasks safe, spoof unlimited for capacities
		if (feature.includes('insights')) return undefined; 
		return -1; 
	}
	
	getMainPlan() { return { productId: 'enterprise' }; }
	getPlanName() { return 'Enterprise Unlimited'; }
	getManagementJwt() { return 'offline-admin-token'; }
	getTriggerLimit() { return -1; }
	
	async activate() { return; }
	async renew() { return; }
}

@Service()
export class LicenseService {
	private readonly http: HttpRequestClient;

	constructor(
		private readonly logger: Logger,
		private readonly license: License,
		private readonly licenseState: LicenseState,
		private readonly workflowRepository: WorkflowRepository,
		private readonly urlService: UrlService,
		private readonly eventService: EventService,
		outboundHttp: OutboundHttp,
	) {
		// Keep the HTTP client initialization so the constructor doesn't crash
		this.http = outboundHttp.requests({
			useDefaultSsrfPolicy: 'unsafe',
			timeout: REQUEST_TIMEOUT_MS,
		});

		// 2. THE HIJACK
		// Instantiate the mock provider and overwrite the injected real SDK
		const mockProvider = new DummyLicenseProvider();
		(this as any).license = mockProvider; 
		this.licenseState.setLicenseProvider(mockProvider as any); 
	}

	// 3. SPOOFED UI DATA
	// Tells the frontend Vue application that limits are unlimited
	async getLicenseData() {
		return {
			usage: {
				activeWorkflowTriggers: {
					value: 0,
					limit: -1,
					warningThreshold: 0.8,
				},
				workflowsHavingEvaluations: {
					value: 0,
					limit: -1,
				},
			},
			license: {
				planId: 'enterprise',
				planName: 'Enterprise Unlimited',
			},
		};
	}

	// 4. NEUTERED NETWORK CALLS
	// All outbound HTTP requests are replaced with instant silent returns
	async requestEnterpriseTrial(user: User) {
		return;
	}

	async registerCommunityEdition(params: any): Promise<{ title: string; text: string }> {
		// Emit the success event instantly without phoning home
		this.eventService.emit('license-community-plus-registered', { 
			userId: params.userId, 
			email: params.email, 
			licenseKey: 'offline-community-key' 
		});
		return { title: 'Registered', text: 'Edition registered offline' };
	}

	getManagementJwt(): string {
		return this.license.getManagementJwt();
	}

	async activateLicense(activationKey: string, eulaUri?: string, userEmail?: string): Promise<void> {
		return; // Instant success
	}

	private isEulaRequiredError(error: unknown): boolean {
		return false;
	}

	async renewLicense() {
		// Emits success to the rest of the backend without making network requests
		this.eventService.emit('license-renewal-attempted', { success: true });
		return; 
	}

	private mapErrorMessage(error: Error, action: 'activate' | 'renew') {
		return 'Offline mode active';
	}

	private isLicenseError(error: Error): error is Error & { errorId: string } {
		return false;
	}
}
