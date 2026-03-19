import { createMockDeps } from '../../test-utils/mockDeps.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import * as exportUtils from '../../utils/exportLogs/index.js';
import {
	copyCurrentLogsCommand,
	exportAllLogsCommand,
	exportCurrentLogsCommand,
} from './index.js';

const logsForTask = vi.fn().mockReturnValue([
	{
		id: '1',
		task: 'task1',
		text: 'hello',
		type: LOG_TYPE.STDOUT,
		timestamp: '10:00:00',
	},
]);

afterEach(() => {
	vi.restoreAllMocks();
});

describe('exportCurrentLogsCommand', () => {
	it('has correct id', () => {
		expect(exportCurrentLogsCommand.id).toBe('EXPORT_CURRENT_LOGS');
	});

	it('has correct key (e with ctrl)', () => {
		expect(exportCurrentLogsCommand.keys).toEqual([
			{ textKey: 'e', ctrl: true, shift: false },
		]);
	});

	it('has correct displayText', () => {
		expect(exportCurrentLogsCommand.displayText).toBe('save log');
	});

	describe('isEnabled', () => {
		it('returns true when tasks exist and selector hidden', () => {
			expect(exportCurrentLogsCommand.isEnabled(createMockDeps())).toBe(
				true,
			);
		});

		it('returns false when script selector is shown', () => {
			expect(
				exportCurrentLogsCommand.isEnabled(
					createMockDeps({ showScriptSelector: true }),
				),
			).toBe(false);
		});

		it('returns false when no tasks', () => {
			expect(
				exportCurrentLogsCommand.isEnabled(createMockDeps({ tasks: [] })),
			).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls saveLogsToFile with the active task and formatted logs', () => {
			const saveSpy = vi
				.spyOn(exportUtils, 'saveLogsToFile')
				.mockResolvedValue('/logs/task1.log');
			const providers = createMockDeps({ getLogsForTask: logsForTask });

			exportCurrentLogsCommand.execute(providers);

			expect(providers.logs.getLogsForTask).toHaveBeenCalledWith('task1', null);
			expect(saveSpy).toHaveBeenCalledWith('task1', '[10:00:00] hello');
		});

		it('does nothing if no active task', () => {
			const saveSpy = vi
				.spyOn(exportUtils, 'saveLogsToFile')
				.mockResolvedValue('');
			const providers = createMockDeps({ activeTask: undefined });

			exportCurrentLogsCommand.execute(providers);

			expect(saveSpy).not.toHaveBeenCalled();
		});
	});
});

describe('exportAllLogsCommand', () => {
	it('has correct id', () => {
		expect(exportAllLogsCommand.id).toBe('EXPORT_ALL_LOGS');
	});

	it('has correct key (E with shift)', () => {
		expect(exportAllLogsCommand.keys).toEqual([
			{ textKey: 'E', ctrl: false, shift: true },
		]);
	});

	it('has correct displayText', () => {
		expect(exportAllLogsCommand.displayText).toBe('save all');
	});

	describe('execute', () => {
		it('calls saveLogsToFile for each task', () => {
			const saveSpy = vi
				.spyOn(exportUtils, 'saveLogsToFile')
				.mockResolvedValue('');
			const providers = createMockDeps({ tasks: ['task1', 'task2'], getLogsForTask: logsForTask });

			exportAllLogsCommand.execute(providers);

			expect(saveSpy).toHaveBeenCalledTimes(2);
			expect(saveSpy).toHaveBeenCalledWith('task1', expect.any(String));
			expect(saveSpy).toHaveBeenCalledWith('task2', expect.any(String));
		});
	});
});

describe('copyCurrentLogsCommand', () => {
	it('has correct id', () => {
		expect(copyCurrentLogsCommand.id).toBe('COPY_CURRENT_LOGS');
	});

	it('has correct key (y with ctrl)', () => {
		expect(copyCurrentLogsCommand.keys).toEqual([{ textKey: 'y', ctrl: true }]);
	});

	it('has correct displayText', () => {
		expect(copyCurrentLogsCommand.displayText).toBe('copy log');
	});

	describe('execute', () => {
		it('calls copyToClipboard with formatted logs', () => {
			const clipSpy = vi
				.spyOn(exportUtils, 'copyToClipboard')
				.mockResolvedValue(undefined);
			const providers = createMockDeps({ getLogsForTask: logsForTask });

			copyCurrentLogsCommand.execute(providers);

			expect(clipSpy).toHaveBeenCalledWith('[10:00:00] hello');
		});

		it('does nothing if no active task', () => {
			const clipSpy = vi
				.spyOn(exportUtils, 'copyToClipboard')
				.mockResolvedValue(undefined);
			const providers = createMockDeps({ activeTask: undefined });

			copyCurrentLogsCommand.execute(providers);

			expect(clipSpy).not.toHaveBeenCalled();
		});
	});
});
