import React, { useState } from 'react';
import { LoginService, TeacherService } from 'services';
import { Container, Text, Button } from '../primitives';

const LoginScreen: React.FC = () => {
  const [error, setError] = useState('');
  const [teacher, setTeacher] = useState('');
  const service = new LoginService();
  const service2 = new TeacherService();

  const onGetData = async () => {
    try {
      const data = await service2.findTeacher();
      setTeacher(
        data ? `FOUND: ${data[0].name} - ${data[0].bio}` : 'None Found',
      );
    } catch (err) {
      setError('Data error!');
    }
  };

  const onLogin = async () => {
    try {
      await service.login('test@test.com', 'testing');
    } catch (err) {
      setError('Did not work');
    }
  };

  return (
    <Container>
      <Text>Login</Text>
      <Button text="Login" onPress={onLogin} />
      <Text>Teacher: {teacher ? teacher : 'Click button'}</Text>
      <Button text="Get Data" onPress={onGetData} />
      {/* {error && <Text>{error}</Text>} */}
    </Container>
  );
};

export default LoginScreen;
