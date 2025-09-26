import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
    };

    return (
        <div className="auth-page-wrapper">
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Row className="w-100">
                    <Col md={8} lg={6} xl={5} className="mx-auto">
                        <Card className="shadow-lg p-4 custom-card-login">
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <h2 className="card-title-custom">Welcome Back!</h2>
                                    <p className="text-muted">Sign in to your account</p>
                                </div>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <InputGroup className="input-group-custom">
                                            <InputGroup.Text className="input-icon-bg"><FaUser /></InputGroup.Text>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="form-control-custom"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="formBasicPassword">
                                        <InputGroup className="input-group-custom">
                                            <InputGroup.Text className="input-icon-bg"><FaLock /></InputGroup.Text>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="form-control-custom"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <div className="d-grid gap-2 mb-3">
                                        <Button variant="primary" type="submit" className="btn-custom-primary">
                                            Login
                                        </Button>
                                    </div>
                                    <div className="text-center">
                                        <a href="#forgot-password" className="text-decoration-none">Forgot password?</a>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="text-center">
                                        Don't have an account? <a href="/signup" className="text-decoration-none">Sign up</a>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;