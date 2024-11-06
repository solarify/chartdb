import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/button/button';
import {
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/dialog/dialog';
import type { DatabaseType } from '@/lib/domain/database-type';
import type { DatabaseEdition } from '@/lib/domain/database-edition';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import {
    fixMetadataJson,
    isStringMetadataJson,
} from '@/lib/data/import-metadata/utils';

export interface ImportDWHProps {
    goBack?: () => void;
    onImport: (scriptResult: string) => void;
    onCreateEmptyDiagram?: () => void;
    scriptResult: string;
    setScriptResult: React.Dispatch<React.SetStateAction<string>>;
    databaseType: DatabaseType;
    databaseEdition?: DatabaseEdition;
    setDatabaseEdition: React.Dispatch<
        React.SetStateAction<DatabaseEdition | undefined>
    >;
    keepDialogAfterImport?: boolean;
    title: string;
}

export const ImportDWH: React.FC<ImportDWHProps> = ({
    goBack,
    scriptResult,
    setScriptResult,
    onImport,
    onCreateEmptyDiagram,
    keepDialogAfterImport,
    title,
}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [fileListed, setfileListed] = useState(false);
    let targetScript: string = '';
    const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
    const { t } = useTranslation();
    const { isSm: isDesktop } = useBreakpoint('sm');
    const [showCheckJsonButton] = useState(false);

    const setTargetScript = useCallback((script: string) => {
        targetScript = script;
    }, []);
    () => setTargetScript('');

    useEffect(() => {
        fetchFilesFromStorage();

        setInfoMessage('Listing files...');
    }, []);

    const handleImport = useCallback(() => {
        if (errorMessage.length === 0 && scriptResult.trim().length !== 0) {
            onImport(scriptResult);
        }
    }, [errorMessage.length, onImport, scriptResult]);

    const handleCheckJson = useCallback(async () => {
        setInfoMessage('Checking json result...');
        const fixedJson = await fixMetadataJson(scriptResult);
        if (isStringMetadataJson(fixedJson)) {
            scriptResult = fixedJson;
            setErrorMessage('');
        } else {
            setErrorMessage('json script result not valid');
        }
    }, [scriptResult, setScriptResult, setInfoMessage]);

    const fetchFilesFromStorage = useCallback(async () => {
        try {
            const storage = getStorage();
            const directoryRef = ref(storage, '');
            const fileList = await listAll(directoryRef);
            setInfoMessage('Listing files...');
            const filesData = await Promise.all(
                fileList.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    return {
                        name: itemRef.name,
                        url,
                    };
                })
            );

            console.log('Files:', filesData);
            setFiles(filesData);
            setInfoMessage('Files downloaded');
            setfileListed(true);
        } catch (error) {
            console.log('error:', error);
            setErrorMessage('Error accessing Firebase Storage: ' + error);
            setInfoMessage('');
        }
    }, [setErrorMessage, setFiles, setInfoMessage]);

    const fetchScriptResultFromStorage = useCallback(async () => {
        if (targetScript === '') {
            console.log('Please select a file');
            setErrorMessage('Please select a file');
            return;
        }
        try {
            setInfoMessage('Wait, dwh shemas is downloading...');
            const storage = getStorage();
            const fileRef = ref(storage, targetScript);
            const url = await getDownloadURL(fileRef);
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            const dataString = JSON.stringify(data);
            scriptResult = dataString;
            setScriptResult(scriptResult);
            handleCheckJson();
            handleImport();
            console.log('handle import');
        } catch (error) {
            console.log('error:', error);
            setErrorMessage(
                "Erreur lors de l'accès à Firebase Storage: " + error
            );
        }
    }, [setScriptResult]);

    const renderHeader = useCallback(() => {
        return (
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>Chose a file to import</DialogDescription>
            </DialogHeader>
        );
    }, [title]);
    const renderFooter = useCallback(() => {
        return (
            <DialogFooter className="mt-4 flex !justify-between gap-2">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
                    {onCreateEmptyDiagram && (
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCreateEmptyDiagram}
                            >
                                {t('new_diagram_dialog.empty_diagram')}
                            </Button>
                        </DialogClose>
                    )}
                    <div>
                        {fileListed && (
                            <div className="flex items-center ">
                                <div className="mr-2 flex items-center gap-2">
                                    <label
                                        htmlFor="fileDropdown"
                                        className="text-sm "
                                    >
                                        Select Version:
                                    </label>
                                    <select
                                        id="fileDropdown"
                                        onChange={(e) =>
                                            setTargetScript(e.target.value)
                                        }
                                        className="rounded border bg-slate-700 p-2"
                                    >
                                        <option value="">
                                            choose a version...
                                        </option>
                                        {files.map((file) => (
                                            <option
                                                key={file.name}
                                                value={file.name}
                                            >
                                                {file.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={fetchScriptResultFromStorage}
                                >
                                    Import
                                </Button>
                                <DialogClose asChild></DialogClose>
                            </div>
                        )}

                        <div className="mr-20 mt-5 flex space-x-2">
                            {errorMessage && (
                                <p className="rounded-lg bg-red-500 bg-opacity-30 p-2 text-red-600">
                                    Error: {errorMessage}
                                </p>
                            )}
                            {infoMessage && (
                                <p className="rounded-lg bg-blue-500 bg-opacity-30 p-2 text-blue-600">
                                    Info: {infoMessage}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </DialogFooter>
        );
    }, [
        handleImport,
        isDesktop,
        keepDialogAfterImport,
        onCreateEmptyDiagram,
        errorMessage.length,
        scriptResult,
        showCheckJsonButton,
        goBack,
        t,
        files,
        setTargetScript,
        fetchScriptResultFromStorage,
    ]);

    return (
        <>
            {renderHeader()}
            {renderFooter()}
        </>
        //{renderContent()}
    );
};
