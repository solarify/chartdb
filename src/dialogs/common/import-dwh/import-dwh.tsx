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
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

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
    const { t } = useTranslation();
    const { isSm: isDesktop } = useBreakpoint('sm');
    const [showCheckJsonButton] = useState(false);

    useEffect(() => {
        fetchScriptResultFromStorage();
    }, []);

    const handleImport = useCallback(() => {
        if (errorMessage.length === 0 && scriptResult.trim().length !== 0) {
            onImport(scriptResult);
        }
    }, [errorMessage.length, onImport, scriptResult]);

    const handleCheckJson = useCallback(async () => {
        const fixedJson = await fixMetadataJson(scriptResult);
        if (isStringMetadataJson(fixedJson)) {
            scriptResult = fixedJson;
            setErrorMessage('');
        } else {
            setErrorMessage('json script result not valid');
        }
    }, [scriptResult, setScriptResult]);

    const fetchScriptResultFromStorage = useCallback(async () => {
        setErrorMessage('Wait ');
        try {
            const storage = getStorage();
            const fileRef = ref(storage, 'result.json');
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
                <DialogDescription className="hidden" />
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

                    <DialogClose asChild></DialogClose>

                    <p className="text-red-600">{errorMessage}</p>
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
    ]);

    return (
        <>
            {renderHeader()}
            {renderFooter()}
        </>
        //{renderContent()}
    );
};
