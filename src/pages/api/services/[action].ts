import type { Action, Handler } from 'src/types/next-handler';
import type { Service } from 'src/types/services';

import { generatorRespError } from 'src/utils/handler';
import { addServicesData, deleteServicesData, editServiceData, updateServiceData } from 'src/utils/services';

const addHandler: Handler = async (req, res) => {
  const data = JSON.parse(req.body) as Service;

  if (!data)
    res.status(400).json(generatorRespError('数据不能为空'));

  try {
    await addServicesData(data);
  } catch {
    res.status(500).json(generatorRespError('服务器错误'));
  }

  res.status(200).json({ msg: `添加 ${data.name} 成功` });
};

const deleteHandler: Handler = async (req, res) => {
  const data = req.body;

  if (!data)
    res.status(400).json(generatorRespError('删除的目标卡片名为空'));

  try {
    await deleteServicesData(data);
  } catch {
    res.status(500).json(generatorRespError('服务器错误'));
  }

  res.status(200).json({ msg: `删除 ${data} 成功` });
};

const editHandler: Handler = async (req, res) => {
  const data = JSON.parse(req.body) as Service & { oldName: string };

  if (!data)
    res.status(400).json(generatorRespError('数据不能为空'));

  try {
    await editServiceData(data);
  } catch {
    res.status(500).json(generatorRespError('服务器错误'));
  }

  res.status(200).json({ msg: `编辑 ${data.oldName} 成功` });
};

const updateHandler: Handler = async (req, res) => {
  const data = JSON.parse(req.body) as Service[];

  if (!data)
    res.status(400).json(generatorRespError('数据不能为空'));

  try {
    await updateServiceData(data);
  } catch {
    res.status(500).json(generatorRespError('服务器错误'));
  }

  res.status(200).json({ msg: '更新成功' });
};

const handler: Handler = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json(generatorRespError(`请求方法 ${req.method ?? ''} 不支持`));
  } else {
    const action = req.query.action as Action;

    switch (action) {
      case 'add':
        addHandler(req, res);
        break;
      case 'delete':
        deleteHandler(req, res);
        break;
      case 'edit':
        editHandler(req, res);
        break;
      case 'update':
        updateHandler(req, res);
        break;
      default:
        res.status(400).json(generatorRespError('未知操作'));
    }

  }
};

export default handler;
