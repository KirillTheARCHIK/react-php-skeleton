<?php

namespace App\Listener\Doctrine;

use App\Service\Utility\PathHelper;
use Gedmo\Uploadable\FileInfo\FileInfoArray;
use Gedmo\Uploadable\MimeType\MimeTypeGuesser;
use Gedmo\Uploadable\MimeType\MimeTypeGuesserInterface;

class UploadableListener extends \Gedmo\Uploadable\UploadableListener
{
    public const ACTION_INSERT = 'INSERT';
    public const ACTION_UPDATE = 'UPDATE';

    /**
     * Default path to move files in.
     *
     * @var string
     */
    private $defaultPath;

    /**
     * Mime type guesser.
     *
     * @var MimeTypeGuesserInterface
     */
    private $mimeTypeGuesser;

    /**
     * Default FileInfoInterface class.
     *
     * @var string
     */
    private $defaultFileInfoClass = FileInfoArray::class;

    /**
     * Array of files to remove on postFlush.
     *
     * @var array
     */
    private $pendingFileRemovals = [];

    /**
     * Array of FileInfoInterface objects. The index is the hash of the entity owner
     * of the FileInfoInterface object.
     *
     * @var array
     */
    private $fileInfoObjects = [];

    /**
     * @var string|null
     */
    private $projectDir;

    public function __construct(MimeTypeGuesserInterface $mimeTypeGuesser = null, $projectDir = null)
    {
        $this->mimeTypeGuesser = $mimeTypeGuesser ?? new MimeTypeGuesser();
        parent::__construct($mimeTypeGuesser);
        $this->projectDir = $projectDir;
    }

    /**
     * Simple wrapper method used to move the file. If it's an uploaded file
     * it will use the "move_uploaded_file method. If it's not, it will
     * simple move it.
     *
     * @param string $source         Source file
     * @param string $dest           Destination file
     * @param bool   $isUploadedFile Whether this is an uploaded file?
     *
     * @return bool
     */
    public function doMoveFile($source, $dest, $isUploadedFile = true)
    {
        if ($this->projectDir && '/' !== mb_substr($dest, 0, 1)) {
            $dest = PathHelper::getPublicDir($this->projectDir).'/'.$dest;
        }
        if (!is_dir(dirname($dest))) {
            mkdir(dirname($dest), 0775, true);
        }

        return $isUploadedFile ? @move_uploaded_file($source, $dest) : @copy($source, $dest);
    }
}
