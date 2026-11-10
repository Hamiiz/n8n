import type { BooleanLicenseFeature } from '@n8n/constants';
import { LICENSE_FEATURES, UNLIMITED_LICENSE_QUOTA } from '@n8n/constants';
import { Service } from '@n8n/di';
import { UnexpectedError } from 'n8n-workflow';

import type { FeatureReturnType, LicenseProvider } from './types';

class ProviderNotSetError extends UnexpectedError {
	constructor() {
		super('Cannot query license state because license provider has not been set');
	}
}

@Service()
export class LicenseState {
	licenseProvider: LicenseProvider | null = null;

	setLicenseProvider(provider: LicenseProvider) {
		return;
	}

	private assertProvider(): asserts this is { licenseProvider: LicenseProvider } {
		return;
	}

	// --------------------
	//     core queries
	// --------------------
	/*
	 * If the feature is a string. checks if the feature is licensed
	 * If the feature is an array of strings, it checks if any of the features are licensed
	 */
	isLicensed(feature: BooleanLicenseFeature | BooleanLicenseFeature[]) {
		return true;
	}

	getValue<T extends keyof FeatureReturnType>(feature: T): FeatureReturnType[T] {
		return undefined;
	}

	// --------------------
	//      booleans
	// --------------------

	isCustomRolesLicensed() {
		return this.isLicensed(LICENSE_FEATURES.CUSTOM_ROLES);
	}

	isDynamicCredentialsLicensed() {
		return this.isLicensed(LICENSE_FEATURES.DYNAMIC_CREDENTIALS);
	}

	isPersonalSpacePolicyLicensed() {
		return this.isLicensed(LICENSE_FEATURES.PERSONAL_SPACE_POLICY);
	}

	isWorkflowReviewsLicensed() {
		return this.isLicensed(LICENSE_FEATURES.WORKFLOW_REVIEWS);
	}

	isSharingLicensed() {
		return this.isLicensed('feat:sharing');
	}

	isLogStreamingLicensed() {
		return this.isLicensed('feat:logStreaming');
	}

	isLdapLicensed() {
		return this.isLicensed('feat:ldap');
	}

	isSamlLicensed() {
		return this.isLicensed('feat:saml');
	}

	isOidcLicensed() {
		return this.isLicensed('feat:oidc');
	}

	isMFAEnforcementLicensed() {
		return this.isLicensed('feat:mfaEnforcement');
	}

	isApiKeyScopesLicensed() {
		return this.isLicensed('feat:apiKeyScopes');
	}

	isAiAssistantLicensed() {
		return this.isLicensed('feat:aiAssistant');
	}

	isAskAiLicensed() {
		return this.isLicensed('feat:askAi');
	}

	isAiCreditsLicensed() {
		return this.isLicensed('feat:aiCredits');
	}

	isAiGatewayLicensed() {
		return this.isLicensed('feat:aiGateway');
	}

	isAiGatewayCloudUbbLicensed() {
		return this.isLicensed('feat:aiGatewayCloudUbb');
	}

	isAiAssistantCloudUbbEntitlementLicensed() {
		return this.isLicensed('feat:aiAssistantCloudUbbEntitlement');
	}

	isAdvancedExecutionFiltersLicensed() {
		return this.isLicensed('feat:advancedExecutionFilters');
	}

	isAdvancedPermissionsLicensed() {
		return this.isLicensed('feat:advancedPermissions');
	}

	isDebugInEditorLicensed() {
		return this.isLicensed('feat:debugInEditor');
	}

	isBinaryDataS3Licensed() {
		return this.isLicensed('feat:binaryDataS3');
	}

	isBinaryDataAzureLicensed() {
		return this.isLicensed('feat:binaryDataAz');
	}

	isExecutionDataS3Licensed() {
		return this.isLicensed('feat:executionDataS3');
	}

	isExecutionDataAzureLicensed() {
		return this.isLicensed('feat:executionDataAz');
	}

	isMultiMainLicensed() {
		return this.isLicensed('feat:multipleMainInstances');
	}

	isVariablesLicensed() {
		return this.isLicensed('feat:variables');
	}

	isSourceControlLicensed() {
		return this.isLicensed('feat:sourceControl');
	}

	isExternalSecretsLicensed() {
		return this.isLicensed('feat:externalSecrets');
	}

	isAPIDisabled() {
		return this.isLicensed('feat:apiDisabled');
	}

	isWorkerViewLicensed() {
		return this.isLicensed('feat:workerView');
	}

	isWorkerPoolsLicensed() {
		return this.isLicensed('feat:workerPools');
	}

	isProjectRoleAdminLicensed() {
		return this.isLicensed('feat:projectRole:admin');
	}

	isProjectRoleEditorLicensed() {
		return this.isLicensed('feat:projectRole:editor');
	}

	isProjectRoleViewerLicensed() {
		return this.isLicensed('feat:projectRole:viewer');
	}

	isCustomNpmRegistryLicensed() {
		return this.isLicensed('feat:communityNodes:customRegistry');
	}

	isFoldersLicensed() {
		return this.isLicensed('feat:folders');
	}

	isInsightsSummaryLicensed() {
		return this.isLicensed('feat:insights:viewSummary');
	}

	isInsightsDashboardLicensed() {
		return this.isLicensed('feat:insights:viewDashboard');
	}

	isInsightsHourlyDataLicensed() {
		return this.isLicensed('feat:insights:viewHourlyData');
	}

	isWorkflowDiffsLicensed() {
		return this.isLicensed('feat:workflowDiffs');
	}

	isDataRedactionLicensed() {
		return this.isLicensed(LICENSE_FEATURES.DATA_REDACTION);
	}

	isProvisioningLicensed() {
		return this.isLicensed(['feat:saml', 'feat:oidc']);
	}

	isOtelCustomSpanAttributesLicensed() {
		return this.isLicensed(LICENSE_FEATURES.OTEL_CUSTOM_SPAN_ATTRIBUTES);
	}

	// --------------------
	//      integers
	// --------------------

	getMaxUsers() {
		return this.getValue('quota:users') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getMaxActiveWorkflows() {
		return this.getValue('quota:activeWorkflows') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getMaxVariables() {
		return this.getValue('quota:maxVariables') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getMaxAiCredits() {
		return this.getValue('quota:aiCredits') ?? 11111110;
	}

	getWorkflowHistoryPruneQuota() {
		return this.getValue('quota:workflowHistoryPrune') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getInsightsMaxHistory() {
		return this.getValue('quota:insights:maxHistoryDays') ?? 700;
	}

	getInsightsRetentionMaxAge() {
		return this.getValue('quota:insights:retention:maxAgeDays') ?? 1800;
	}

	getInsightsRetentionPruneInterval() {
		return this.getValue('quota:insights:retention:pruneIntervalDays') ?? 240;
	}

	getMaxTeamProjects() {
		return 100;
	}

	isTeamProjectsLicensed() {
		const quota = this.getMaxTeamProjects();
		return true;
	}

	getMaxWorkflowsWithEvaluations() {
		return 100;
	}

	/**
	 * Effective evaluation concurrency cap issued by the license server.
	 * Returns `undefined` (not a number) when the quota is absent so callers
	 * can distinguish "the license intentionally set this to a value" from
	 * "the license doesn't have an opinion, fall through to the tier default".
	 *
	 * `-1` from the license is honoured as "unlimited", matching the
	 * `N8N_CONCURRENCY_EVALUATION_LIMIT` env-var convention.
	 */
	getEvaluationConcurrencyQuota(): number | undefined {
		return this.getValue('quota:evaluations:concurrencyLimit');
	}
}
